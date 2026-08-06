import { embed } from './potion';
import { expandQuery } from './synonyms';

import type { PotionModel } from './potion';
import type { SearchEntry, SearchIndex, SearchName } from './types';

/** Heading vs. body weighting — a matching headline outranks matching prose. */
const HEADING_WEIGHT = 0.6;
const BODY_WEIGHT = 0.4;

/**
 * Cosine floor — vector search always returns its nearest neighbour, so without
 * a cutoff nonsense queries confidently return something.
 *
 * ponytail: absolute cosine is not calibrated across entries. Gibberish reaches
 * ~0.32 against short API entries while a weak-but-real match can sit at ~0.21,
 * so this threshold trades some recall for a clean empty state rather than
 * separating meaning from noise. Score against the query's own distribution
 * (or add a lexical signal) if the empty state starts misfiring.
 */
const MIN_SCORE = 0.35;

/**
 * Budgeted per kind, not shared. Prose always sorts above reference material, so
 * a single pool would let documentation fill every slot and hide the API group
 * entirely on queries that have good matches in both.
 */
const MAX_RESULTS: Record<SearchEntry['kind'], number> = { doc: 12, api: 4 };

/** Keeps one page from filling the whole result list with its own sections. */
const MAX_PER_ROUTE = 2;

const MAX_NAME_RESULTS = 6;

/**
 * Lexical scores sit above every cosine so a literal title match always leads.
 * Static embeddings have no prefix tolerance at all — "accordio" tokenizes to
 * subwords that resemble nothing, so mid-word typing finds nothing semantically
 * until the word is finished. Matching titles by word prefix covers that.
 */
const LEXICAL_HEADING = 1;
const LEXICAL_PAGE = 0.95;
const LEXICAL_SECTION = 0.9;

export type SearchResult = SearchEntry & { score: number };

/** True when any word in `text` starts with `needle`, or `text` contains a multi-word `needle`. */
function matchesPrefix(text: string, needle: string): boolean {
  const lower = text.toLowerCase();
  if (needle.includes(' ')) {
    return lower.includes(needle);
  }
  return lower.split(/[^a-z0-9]+/).some(word => word.startsWith(needle));
}

/**
 * Title matching, by word prefix. Runs before the model has loaded and carries
 * partial words that {@link rankEntries} cannot see.
 */
export function rankLexical(entries: SearchEntry[], query: string): SearchResult[] {
  const needle = query.trim().toLowerCase();
  if (needle.length < 2) {
    return [];
  }

  const results: SearchResult[] = [];
  for (const entry of entries) {
    const score = matchesPrefix(entry.heading, needle)
      ? LEXICAL_HEADING
      : matchesPrefix(entry.page, needle)
        ? LEXICAL_PAGE
        : entry.section && matchesPrefix(entry.section, needle)
          ? LEXICAL_SECTION
          : 0;
    if (score > 0) {
      results.push({ ...entry, score });
    }
  }
  return results;
}

/**
 * Substring lookup over selectors, class names and API members — the only
 * reliable way to hit an identifier, since static embeddings tokenize
 * `iconClose` into unrecognizable subwords. Needs no model.
 */
export function rankNames(names: SearchName[], query: string): SearchName[] {
  const needle = query.trim().toLowerCase();
  if (needle.length < 2) {
    return [];
  }
  return names
    .filter(name => name.name.toLowerCase().includes(needle))
    .sort((a, b) => {
      const aStarts = a.name.toLowerCase().startsWith(needle) ? 0 : 1;
      const bStarts = b.name.toLowerCase().startsWith(needle) ? 0 : 1;
      return aStarts - bStarts || a.name.length - b.name.length;
    })
    .slice(0, MAX_NAME_RESULTS);
}

/** Scores every entry above {@link MIN_SCORE} by cosine, unordered and uncapped. */
export function rankEntries(
  model: PotionModel,
  index: SearchIndex,
  vectors: Int8Array,
  query: string
): SearchResult[] {
  if (!query.trim()) {
    return [];
  }

  const dim = index.dim;
  const queryVector = embed(model, expandQuery(query));
  const scored: SearchResult[] = [];

  index.entries.forEach((entry, i) => {
    const headingAt = i * 2 * dim;
    const bodyAt = headingAt + dim;
    let heading = 0;
    let body = 0;
    for (let d = 0; d < dim; d++) {
      const q = queryVector[d] ?? 0;
      heading += q * (vectors[headingAt + d] ?? 0);
      body += q * (vectors[bodyAt + d] ?? 0);
    }
    // Vectors are unit vectors scaled by 127, so this is a weighted cosine.
    const score = (HEADING_WEIGHT * heading + BODY_WEIGHT * body) / 127;
    if (score >= MIN_SCORE) {
      scored.push({ ...entry, score });
    }
  });

  return scored;
}

/**
 * Merges the lexical and semantic passes into the final list: best score per
 * entry, capped per page so one control cannot fill the whole thing.
 */
export function mergeResults(...passes: SearchResult[][]): SearchResult[] {
  const best = new Map<string, SearchResult>();
  for (const result of passes.flat()) {
    const key = `${result.route}#${result.anchor}`;
    const seen = best.get(key);
    if (!seen || result.score > seen.score) {
      best.set(key, result);
    }
  }

  // Prose first, then reference material. An API member is the right answer only
  // when you already know its name, and the exact-name lookup covers that.
  const ordered = [...best.values()].sort(
    (a, b) => (a.kind === b.kind ? 0 : a.kind === 'doc' ? -1 : 1) || b.score - a.score
  );

  const perRoute = new Map<string, number>();
  const perKind = new Map<SearchEntry['kind'], number>();
  const results: SearchResult[] = [];
  for (const result of ordered) {
    const routeCount = perRoute.get(result.route) ?? 0;
    const kindCount = perKind.get(result.kind) ?? 0;
    if (routeCount >= MAX_PER_ROUTE || kindCount >= MAX_RESULTS[result.kind]) {
      continue;
    }
    perRoute.set(result.route, routeCount + 1);
    perKind.set(result.kind, kindCount + 1);
    results.push(result);
  }
  return results;
}
