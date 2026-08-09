/**
 * Turns the published fp32 `potion-base-8M` weights into the int8 blob the docs
 * search ships (~30MB → ~7.7MB), so the blob stays out of the repository.
 *
 *   pnpm --filter @awdlab/jig-docs search:model
 *
 * Runs from `prepare-docs` and returns immediately once {@link REVISION}'s blob is
 * on disk; `--force` regenerates anyway. Downloads are cached under
 * `.potion-cache`, so only a cold checkout pulls the 30MB. Pure Node — the one
 * non-portable dependency, transformers.js, is behind `--verify` alone.
 *
 * `--verify` additionally runs the model's official ONNX graph through
 * transformers.js and compares it to our hand-rolled gather-and-mean, which is
 * the only check that the two agree on semantics rather than just on each other.
 */
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

import { decodePotion, embed, encodePotion, UNK_TOKEN_ID } from '../src/app/utils/search/potion';
import { tokenize } from '../src/app/utils/search/tokenizer';

import type { PotionModel } from '../src/app/utils/search/potion';

const REPO = 'minishlab/potion-base-8M';

/**
 * Pinned upstream commit — `main` would let the weights move under us, and a
 * regenerated blob has to match the one the vectors were built with. Bump this to
 * take a new model, and the stale cache and blob are both replaced.
 */
const REVISION = 'bf8b056651a2c21b8d2565580b8569da283cab23';

const FILES = ['model.safetensors', 'vocab.txt'] as const;

const CACHE_DIR = join(import.meta.dirname, '../.potion-cache', REVISION);
const OUT_DIR = join(import.meta.dirname, '../public/search/model');

/** Records which revision the blob on disk came from. */
const STAMP = join(OUT_DIR, 'revision.txt');

/** Cached so repeated runs don't re-pull 30MB. */
async function fetchModelFile(name: string): Promise<Buffer> {
  const cached = join(CACHE_DIR, name);
  try {
    return await readFile(cached);
  } catch {
    // Not cached yet.
  }
  const res = await fetch(`https://huggingface.co/${REPO}/resolve/${REVISION}/${name}`);
  if (!res.ok) {
    throw new Error(`Failed to download ${name}: ${res.status} ${res.statusText}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await mkdir(dirname(cached), { recursive: true });
  await writeFile(cached, buf);
  return buf;
}

type SafeTensor = { weights: Float32Array; vocab: number; dim: number };

/** Reads the single `embeddings` tensor out of a safetensors container. */
function readEmbeddings(buf: Buffer): SafeTensor {
  const headerLength = Number(buf.readBigUInt64LE(0));
  const header = JSON.parse(buf.subarray(8, 8 + headerLength).toString()) as Record<
    string,
    { dtype: string; shape: number[]; data_offsets: [number, number] }
  >;
  const entry = header['embeddings'];
  if (!entry) {
    throw new Error('safetensors has no `embeddings` tensor');
  }
  if (entry.dtype !== 'F32') {
    throw new Error(`Expected F32 embeddings, got ${entry.dtype}`);
  }
  const [vocab, dim] = entry.shape as [number, number];
  const start = 8 + headerLength + entry.data_offsets[0];
  const end = 8 + headerLength + entry.data_offsets[1];
  // Copy into a buffer of our own: a Buffer view can sit at an arbitrary offset in a
  // shared pool, which is neither 4-byte aligned nor safe to read whole.
  const bytes = new Uint8Array(end - start);
  bytes.set(buf.subarray(start, end));
  return { weights: new Float32Array(bytes.buffer), vocab, dim };
}

function cosine(a: Float32Array | number[], b: Float32Array | number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    const x = a[i] ?? 0;
    const y = b[i] ?? 0;
    dot += x * y;
    normA += x * x;
    normB += y * y;
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB) || 1);
}

const PROBES = [
  'How do I disable a select?',
  'dark mode theming tokens',
  'awd-input-field label',
  'booleanAttribute transform on inputs',
  'virtual scrolling long option lists',
  // Tokenizer edge cases: accents, mixed case, punctuation runs, unknown
  // subwords, CJK, digits, and a word past WordPiece's length cap.
  'Größe für Überschrift — naïve café',
  '[(value)]="foo" @if (bar) { <awd-select/> }',
  'ITEM_TEMPLATE vs itemTemplate vs item-template',
  'zzzqqqxxx unpronounceable gibberish',
  '日本語のテキストと English mixed',
  'v22.0.5 released 2026-07-31 at 14:03',
  `${'a'.repeat(120)} overlong`,
  '   ',
];

/**
 * End-to-end check of our tokenizer and gather-and-mean against the reference:
 * the real `@huggingface/transformers` tokenizer feeding the model's official
 * ONNX graph. Keeps transformers.js a devDependency — it cannot be bundled for
 * the browser, so `src/app/utils/search/tokenizer.ts` reimplements it.
 */
async function verify(model: PotionModel) {
  // Imported here, not at module scope: transformers.js drags in onnxruntime-node, whose
  // native binding a plain `search:model` run during the docs build must not depend on.
  const { AutoModel, AutoTokenizer, Tensor } = await import('@huggingface/transformers');

  const [onnx, tokenizer] = await Promise.all([
    AutoModel.from_pretrained(REPO, {
      revision: REVISION,
      config: { model_type: 'model2vec' },
      dtype: 'fp32',
    }),
    AutoTokenizer.from_pretrained(REPO, { revision: REVISION }),
  ]);

  let worst = 1;
  const mismatched: string[] = [];

  for (const probe of PROBES) {
    const { input_ids } = tokenizer(probe, { add_special_tokens: false });
    const ids = input_ids.tolist()[0] as bigint[];

    // Token ids first: an embedding cosine can hide a tokenizer disagreement.
    const ours = tokenize(probe, model.vocab, UNK_TOKEN_ID);
    const theirs = ids.map(Number);
    const sameTokens = ours.length === theirs.length && ours.every((id, i) => id === theirs[i]);
    if (!sameTokens) {
      mismatched.push(`${probe}\n    ours:   ${ours}\n    theirs: ${theirs}`);
    }

    // The bare ONNX graph pools whatever ids it is handed; `StaticModel.encode`
    // drops unknowns first. Filter here so both sides pool the same tokens.
    const pooled = ids.filter(id => Number(id) !== UNK_TOKEN_ID);
    if (pooled.length === 0) {
      console.log(`  (no tokens)  ${probe.trim().slice(0, 40) || '<blank>'}`);
      continue;
    }
    const { embeddings } = await onnx({
      input_ids: new Tensor('int64', pooled, [pooled.length]),
      offsets: new Tensor('int64', [0n], [1]),
    });
    const similarity = cosine(embed(model, probe), embeddings.tolist()[0] as number[]);
    worst = Math.min(worst, similarity);
    console.log(
      `  ${similarity.toFixed(6)} ${sameTokens ? ' ' : '✗'} ${probe.slice(0, 60).replace(/\n/g, ' ')}`
    );
  }

  if (mismatched.length > 0) {
    throw new Error(`Tokenizer disagrees with the reference:\n  ${mismatched.join('\n  ')}`);
  }
  if (worst < 0.999) {
    throw new Error(`Quantized embeddings diverge from the ONNX reference (worst ${worst})`);
  }
  console.log(
    `✓ ${PROBES.length} probes: token ids identical, worst embedding cosine ${worst.toFixed(6)}`
  );
}

/** Whether the blob on disk already came from the pinned revision. */
async function upToDate(): Promise<boolean> {
  const exists = (file: string) =>
    access(join(OUT_DIR, file)).then(
      () => true,
      () => false
    );
  const stamp = await readFile(STAMP, 'utf8').catch(() => '');
  return (
    stamp.trim() === REVISION && (await exists('potion.i8.bin')) && (await exists('vocab.txt'))
  );
}

async function main() {
  const force = process.argv.includes('--force');
  const shouldVerify = process.argv.includes('--verify');
  if (!force && !shouldVerify && (await upToDate())) {
    console.log(`potion-base-8M @ ${REVISION.slice(0, 7)}: already generated`);
    return;
  }

  const [safetensors, vocabTxt] = await Promise.all(FILES.map(f => fetchModelFile(f)));

  const { weights, vocab, dim } = readEmbeddings(safetensors!);
  const blob = encodePotion(weights, vocab, dim);
  console.log(
    `potion-base-8M: ${vocab} × ${dim} — ${(safetensors!.length / 1e6).toFixed(1)}MB fp32 → ${(blob.length / 1e6).toFixed(1)}MB int8`
  );

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(join(OUT_DIR, 'potion.i8.bin'), blob);
  await writeFile(join(OUT_DIR, 'vocab.txt'), vocabTxt!);
  // Stamped last, so a run that dies mid-write is not mistaken for a finished one.
  await writeFile(STAMP, `${REVISION}\n`);

  if (shouldVerify) {
    await verify(decodePotion(blob.buffer as ArrayBuffer, vocabTxt!.toString()));
  }
}

await main();
