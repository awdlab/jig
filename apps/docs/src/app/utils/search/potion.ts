import { parseVocab, tokenize } from './tokenizer';

import type { WordPieceVocab } from './tokenizer';

/**
 * Runtime for the [Model2Vec](https://github.com/MinishLab/model2vec) `potion`
 * static embedding models: a text embedding is the mean of its tokens' rows in
 * one lookup table, L2-normalized. No neural net, no ONNX — a gather and a mean.
 *
 * The published weights are fp32 (28MB for potion-base-8M), so
 * `tools/quantize-potion.ts` folds them to per-row int8 (~7.7MB) in the format
 * {@link decodePotion} reads. Build step and browser share this file, so the
 * indexed vectors and a live query can never drift apart.
 */

/** `P8M1` — bump if {@link decodePotion}'s layout changes. */
const MAGIC = 0x314d3850;

const HEADER_BYTES = 12;

/** Mirrors `StaticModel`'s L2 epsilon so a zero vector stays finite. */
const NORM_EPSILON = 1e-32;

/** `[UNK]` in the bge vocabulary this model was distilled from. */
export const UNK_TOKEN_ID = 1;

export type PotionModel = {
  dim: number;
  /** Per-token dequantization factor, indexed by token id. */
  scales: Float32Array;
  /** `vocab × dim` int8 lookup table, row-major. */
  rows: Int8Array;
  vocab: WordPieceVocab;
};

/**
 * Serializes a fp32 lookup table to the quantized blob format, using one scale
 * per token row — rows vary enough in magnitude that a single global scale
 * costs measurable recall.
 */
export function encodePotion(weights: Float32Array, vocab: number, dim: number): Uint8Array {
  const out = new Uint8Array(HEADER_BYTES + vocab * 4 + vocab * dim);
  const view = new DataView(out.buffer);
  view.setUint32(0, MAGIC, true);
  view.setUint32(4, vocab, true);
  view.setUint32(8, dim, true);

  const scales = new Float32Array(out.buffer, HEADER_BYTES, vocab);
  const rows = new Int8Array(out.buffer, HEADER_BYTES + vocab * 4, vocab * dim);

  for (let token = 0; token < vocab; token++) {
    const offset = token * dim;
    let peak = 0;
    for (let d = 0; d < dim; d++) {
      peak = Math.max(peak, Math.abs(weights[offset + d] ?? 0));
    }
    const scale = peak / 127;
    scales[token] = scale;
    if (scale === 0) {
      continue;
    }
    for (let d = 0; d < dim; d++) {
      rows[offset + d] = Math.round((weights[offset + d] ?? 0) / scale);
    }
  }
  return out;
}

export function decodePotion(blob: ArrayBuffer, vocabTxt: string): PotionModel {
  const view = new DataView(blob);
  if (view.getUint32(0, true) !== MAGIC) {
    throw new Error('Not a potion blob — regenerate it with tools/quantize-potion.ts.');
  }
  const vocabSize = view.getUint32(4, true);
  const dim = view.getUint32(8, true);
  return {
    dim,
    scales: new Float32Array(blob, HEADER_BYTES, vocabSize),
    rows: new Int8Array(blob, HEADER_BYTES + vocabSize * 4, vocabSize * dim),
    vocab: parseVocab(vocabTxt),
  };
}

/**
 * Embeds `text` into a unit vector, reproducing `StaticModel.encode`: tokenize
 * without special tokens, drop unknowns, mean-pool, L2-normalize. Text that
 * tokenizes to nothing yields the zero vector, which scores 0 against everything.
 */
export function embed(model: PotionModel, text: string): Float32Array {
  const { dim, rows, scales } = model;
  const out = new Float32Array(dim);
  const ids = tokenize(text, model.vocab, UNK_TOKEN_ID);

  let counted = 0;
  for (const id of ids) {
    if (id === UNK_TOKEN_ID) {
      continue;
    }
    const offset = id * dim;
    const scale = scales[id] ?? 0;
    for (let d = 0; d < dim; d++) {
      out[d] = (out[d] ?? 0) + (rows[offset + d] ?? 0) * scale;
    }
    counted++;
  }
  if (counted === 0) {
    return out;
  }

  let squared = 0;
  for (let d = 0; d < dim; d++) {
    const mean = (out[d] ?? 0) / counted;
    out[d] = mean;
    squared += mean * mean;
  }
  const norm = Math.sqrt(squared) + NORM_EPSILON;
  for (let d = 0; d < dim; d++) {
    out[d] = (out[d] ?? 0) / norm;
  }
  return out;
}
