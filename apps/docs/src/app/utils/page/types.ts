import type { Type } from '@angular/core';

export type NgnDocsMdSection = {
  mdFile: string;
  components?: Type<unknown>[];
};

type Tab = {
  default?: boolean;
} & NgnDocsPage;

type SinglePage = NgnDocsMdSection & {
  kind: 'single';
};

type ComponentPage = {
  kind: 'component';
  component: Type<unknown>;
  /** Inputs bound onto the rendered component via `ngComponentOutletInputs`. */
  inputs?: Record<string, unknown>;
};

type Tabs = {
  kind: 'tabs';
  tabs: Tab[];
};

/**
 * A single, routable documentation page. Lives inside a {@link NgnDocsGroup}.
 * Its URL is `/{tab}/{page}` — groups never appear in the path.
 */
export type NgnDocsPage = {
  title: string;
} & (SinglePage | Tabs | ComponentPage);

/**
 * A visual section within a {@link NgnDocsTab}. Renders as a labeled header in
 * the sidebar but is **not** a route segment — its pages route directly under
 * the tab.
 */
export type NgnDocsGroup = {
  title: string;
  pages: NgnDocsPage[];
};

/**
 * A top-level documentation area (e.g. Guides, Components). Becomes the first
 * URL segment and an entry in the sidebar tab switcher. Its {@link NgnDocsGroup}s
 * organize the menu below the switcher.
 */
export type NgnDocsTab = {
  title: string;
  /** Overrides {@link title} in the browser tab / breadcrumb (e.g. "Component" vs "Components"). */
  tabTitle?: string;
  /** Optional icon shown next to the switcher entry. */
  icon?: string;
  groups: NgnDocsGroup[];
};

export type NgnDocsTabPage = NgnDocsPage & {
  kind: 'tabs';
};

export type NgnDocsSinglePage = NgnDocsPage & {
  kind: 'single';
};
