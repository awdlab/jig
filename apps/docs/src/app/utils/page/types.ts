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
};

type Tabs = {
  kind: 'tabs';
  tabs: Tab[];
};

type Category = {
  kind: 'category';
  tabTitle?: string;
  pages: NgnDocsPage[];
};

export type NgnDocsPage = {
  title: string;
} & (SinglePage | Tabs | Category | ComponentPage);

export type NgnDocsTabPage = NgnDocsPage & {
  kind: 'tabs';
};

export type NgnDocsSinglePage = NgnDocsPage & {
  kind: 'single';
};

export type NgnDocsCategory = NgnDocsPage & {
  kind: 'category';
};
