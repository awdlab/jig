import { Type } from '@angular/core';

export type NgnDocsSection = {
  mdFile: string;
  components?: Type<unknown>[];
};

type Tab = {
  title: string;
  default?: boolean;
} & NgnDocsSection;

type SinglePage = NgnDocsSection & {
  kind: 'single';
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
} & (SinglePage | Tabs | Category);

export type NgnDocsTabPage = NgnDocsPage & {
  kind: 'tabs';
};

export type NgnDocsSinglePage = NgnDocsPage & {
  kind: 'single';
};

export type NgnDocsCategory = NgnDocsPage & {
  kind: 'category';
};
