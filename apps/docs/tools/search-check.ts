/**
 * Relevance check for the generated search index.
 *
 *   pnpm --filter @awdlab/jig-docs search:check
 *
 * Runs real queries through the real ranking code and asserts the expected page
 * lands in the top few results. This is what catches a broken encode, wrong
 * heading weighting, or bad chunking — a build that merely succeeds proves none
 * of it. Add a case whenever a query disappoints in practice.
 */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { decodePotion } from '../src/app/utils/search/potion';
import { mergeResults, rankEntries, rankLexical, rankNames } from '../src/app/utils/search/rank';

import type { SearchResult } from '../src/app/utils/search/rank';
import type { SearchIndex } from '../src/app/utils/search/types';

const SEARCH_DIR = join(import.meta.dirname, '../public/search');

/** How far down the list an expected route still counts as a hit. */
const TOP_N = 3;

/**
 * `query` must surface `route` (a prefix match) within the top {@link TOP_N}, or
 * within `topN` where a case is a known weak spot — those are kept as regression
 * guards so a drop out of the results entirely still fails the check.
 */
const CASES: { query: string; route: string; topN?: number }[] = [
  { query: 'how do I show a modal window', route: 'components/dialog' },
  { query: 'pick a date from a calendar', route: 'components/calendar' },
  { query: 'dropdown to choose one of many options', route: 'components/select' },
  { query: 'show a toast notification', route: 'components/toast' },
  { query: 'temporary alert that fades away', route: 'components/snackbar' },
  { query: 'let the user pick a number with arrows', route: 'components/number-input' },
  { query: 'switch the site to dark colors', route: 'guides/dark-mode' },
  { query: 'how do I install the library', route: 'guides/installation' },
  // The other theming guides crowd this one out; its own prose opens with code.
  { query: 'write my own theme from scratch', route: 'guides/authoring-a-theme', topN: 8 },
  { query: 'pass attributes down to inner elements', route: 'guides/passthrough' },
  { query: 'keyboard navigation for the tree', route: 'components/tree' },
  { query: 'upload files with drag and drop', route: 'components/upload' },
  { query: 'show progress of a long task', route: 'components/progress' },
  { query: 'group buttons that toggle', route: 'components/toggle-button' },
  { query: 'rows of data with sorting', route: 'components/table' },
  { query: 'star rating input', route: 'components/rating' },
  { query: 'split a panel the user can resize', route: 'components/splitter' },
  { query: 'one time password code entry', route: 'components/otp' },
  { query: 'tooltip on hover', route: 'components/tooltip' },
  { query: 'show validation error messages under a field', route: 'components/errors' },
  { query: 'bind a control to a reactive form', route: 'guides/forms-validation' },
  { query: 'set application wide defaults in the provider', route: 'guides/configuration' },
  { query: 'translate the built in labels to german', route: 'guides/i18n' },
  { query: 'test my components with playwright', route: 'guides/testing' },
  { query: 'what renders on the server before hydration', route: 'guides/ssr-hydration' },
  { query: 'make an element draggable with the mouse', route: 'components/movable' },
  // "tab" in the query pulls the tabs control in on the lexical pass, and the
  // concept is unavoidably named "roving tabindex" — guard that it stays found.
  { query: 'roving tabindex single tab stop', route: 'components/roving-focus', topN: 8 },
  { query: 'load more rows when scrolling to the bottom', route: 'components/scroll-amount' },
  { query: 'which browsers are supported', route: 'guides/browser-support' },
  // Partial words: embeddings cannot match a prefix, so these ride entirely on
  // the lexical pass. Typing a control name must work before the word is done.
  { query: 'accordio', route: 'components/accordion' },
  { query: 'accord', route: 'components/accordion' },
  { query: 'splitt', route: 'components/splitter' },
  { query: 'passthr', route: 'guides/passthrough' },
  { query: 'dark mo', route: 'guides/dark-mode' },
];

/** Identifier lookups, which never go through the model. */
const NAME_CASES: { query: string; name: string }[] = [
  { query: 'iconClose', name: 'iconClose' },
  { query: 'jig-select', name: 'jig-select' },
  { query: 'ngnButton', name: 'ngnButton' },
  { query: 'AwdInputField', name: 'AwdInputField' },
  { query: 'closeBy', name: 'closeBy' },
];

async function main() {
  const [indexJson, vectorsBin, blob, vocabTxt] = await Promise.all([
    readFile(join(SEARCH_DIR, 'index.json'), 'utf8'),
    readFile(join(SEARCH_DIR, 'vectors.bin')),
    readFile(join(SEARCH_DIR, 'model/potion.i8.bin')),
    readFile(join(SEARCH_DIR, 'model/vocab.txt'), 'utf8'),
  ]);

  const index = JSON.parse(indexJson) as SearchIndex;
  const vectors = new Int8Array(vectorsBin.buffer, vectorsBin.byteOffset, vectorsBin.byteLength);
  const model = decodePotion(
    blob.buffer.slice(blob.byteOffset, blob.byteOffset + blob.byteLength) as ArrayBuffer,
    vocabTxt
  );

  const failures: string[] = [];

  /** Same composition the service uses, so the check exercises the real path. */
  const search = (query: string): SearchResult[] =>
    mergeResults(rankLexical(index.entries, query), rankEntries(model, index, vectors, query));

  for (const { query, route, topN = TOP_N } of CASES) {
    const results = search(query);
    const rank = results.findIndex(result => result.route.startsWith(route));
    const hit = rank >= 0 && rank < topN;
    if (!hit) {
      failures.push(
        `“${query}” → expected ${route} in top ${topN}, got ${
          results
            .slice(0, TOP_N)
            .map(r => `${r.route}(${r.score.toFixed(2)})`)
            .join(', ') || '<nothing>'
        }`
      );
    }
    console.log(`  ${hit ? '✓' : '✗'} #${rank + 1}${topN === TOP_N ? '' : `/${topN}`} ${query}`);
  }

  for (const { query, name } of NAME_CASES) {
    const found = rankNames(index.names, query).some(result => result.name === name);
    if (!found) {
      failures.push(`“${query}” → no exact name match for ${name}`);
    }
    console.log(`  ${found ? '✓' : '✗'} name ${query}`);
  }

  // A nonsense query must fall below the floor, or the floor is set too low.
  const noise = search('qwertzu asdfgh yxcvbn');
  if (noise.length > 0) {
    failures.push(`nonsense query returned ${noise.length} results (top ${noise[0]!.route})`);
  }

  if (failures.length > 0) {
    console.error(`\n${failures.length} failure(s):`);
    failures.forEach(failure => console.error(`  ${failure}`));
    process.exitCode = 1;
    return;
  }
  console.log(`\n✓ ${CASES.length + NAME_CASES.length + 1} search checks passed`);
}

await main();
