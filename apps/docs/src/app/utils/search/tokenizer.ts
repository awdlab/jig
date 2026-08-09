/**
 * BERT WordPiece tokenizer for the `potion` vocabulary.
 *
 * Hand-rolled rather than pulled from `@huggingface/transformers`, whose entry
 * point wires up `onnxruntime-node` and cannot be bundled for the browser or
 * SSR. `tools/quantize-potion.ts --verify` checks this implementation against
 * the real one end to end.
 *
 * Mirrors `BertNormalizer` (clean text, pad CJK, strip accents, lowercase) plus
 * `BertPreTokenizer` (split on whitespace and punctuation).
 */

/** Above this a "word" is treated as unknown outright, as WordPiece does. */
const MAX_WORD_CHARS = 100;

const CONTINUATION_PREFIX = '##';

const PUNCTUATION = /[!-/:-@[-`{-~\p{P}\p{S}]/u;

const CONTROL = /[\p{Cc}\p{Cf}]/u;

const COMBINING_MARK = /\p{Mn}/gu;

/**
 * BERT's `_is_chinese_char` set: CJK Unified Ideographs, its extensions, and the
 * compatibility blocks. Deliberately excludes hiragana, katakana and hangul —
 * those stay inside a word and take `##` continuations, so treating them as
 * standalone characters yields the wrong token ids.
 */
const CJK_RANGES: [number, number][] = [
  [0x4e00, 0x9fff],
  [0x3400, 0x4dbf],
  [0x20000, 0x2a6df],
  [0x2a700, 0x2b73f],
  [0x2b740, 0x2b81f],
  [0x2b820, 0x2ceaf],
  [0xf900, 0xfaff],
  [0x2f800, 0x2fa1f],
];

function isCjk(char: string): boolean {
  const code = char.codePointAt(0) ?? 0;
  return CJK_RANGES.some(([start, end]) => code >= start && code <= end);
}

export type WordPieceVocab = Map<string, number>;

/** Parses a `vocab.txt`, where line number is the token id. */
export function parseVocab(vocabTxt: string): WordPieceVocab {
  const vocab: WordPieceVocab = new Map();
  vocabTxt.split('\n').forEach((token, id) => {
    const trimmed = token.replace(/\r$/, '');
    if (trimmed) {
      vocab.set(trimmed, id);
    }
  });
  return vocab;
}

/** Normalizes, then splits into whitespace- and punctuation-delimited words. */
function preTokenize(text: string): string[] {
  const normalized = text
    .normalize('NFD')
    .replace(COMBINING_MARK, '')
    .toLowerCase()
    .replace(/\s/g, ' ');

  const words: string[] = [];
  let current = '';
  const flush = () => {
    if (current) {
      words.push(current);
      current = '';
    }
  };

  for (const char of normalized) {
    if (char === ' ' || CONTROL.test(char)) {
      flush();
    } else if (PUNCTUATION.test(char) || isCjk(char)) {
      flush();
      words.push(char);
    } else {
      current += char;
    }
  }
  flush();
  return words;
}

/**
 * Greedy longest-match subword split. A word with any unmatchable piece becomes
 * a single unknown token, matching the reference implementation rather than
 * emitting the pieces that did match.
 */
function wordPiece(word: string, vocab: WordPieceVocab, unkId: number, into: number[]): void {
  if (word.length > MAX_WORD_CHARS) {
    into.push(unkId);
    return;
  }

  const pieces: number[] = [];
  let start = 0;
  while (start < word.length) {
    let end = word.length;
    let matched = -1;
    while (start < end) {
      const piece =
        start === 0 ? word.slice(start, end) : CONTINUATION_PREFIX + word.slice(start, end);
      const id = vocab.get(piece);
      if (id !== undefined) {
        matched = id;
        break;
      }
      end--;
    }
    if (matched === -1) {
      into.push(unkId);
      return;
    }
    pieces.push(matched);
    start = end;
  }
  into.push(...pieces);
}

/** Token ids for `text`, without special tokens. */
export function tokenize(text: string, vocab: WordPieceVocab, unkId: number): number[] {
  const ids: number[] = [];
  for (const word of preTokenize(text)) {
    wordPiece(word, vocab, unkId, ids);
  }
  return ids;
}
