/** One searchable chunk: a markdown section, or a single API member. */
export type SearchEntry = {
  /** Prose ranks above reference material of equal score. */
  kind: 'doc' | 'api';
  /** Router path, without leading slash. */
  route: string;
  /** Heading slug to deep-link to, empty for the top of the page. */
  anchor: string;
  /** Heading text, or the member name for API entries. */
  heading: string;
  /** Owning page title, e.g. `Select`. */
  page: string;
  /** Owning tab title, e.g. `API` — empty for a page's default tab. */
  section: string;
  /** Trimmed prose for the result list. */
  snippet: string;
};

/**
 * An exact-match target: control selectors, class names, inputs and outputs.
 * Static embeddings shred identifiers into subwords, so these are matched by
 * substring instead of by vector.
 */
export type SearchName = {
  name: string;
  route: string;
  anchor: string;
  /** What kind of thing this is, shown as a badge. */
  kind: 'selector' | 'class' | 'member';
};

export type SearchIndex = {
  dim: number;
  entries: SearchEntry[];
  names: SearchName[];
};
