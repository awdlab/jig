import { ALL_COMPONENT_PAGES } from './components';
import { ALL_THEME_PAGES } from './theme';
import { NgnDocsCategory, NgnDocsPage } from '../utils/page/types';

export const ALL_DOCS_PAGES: NgnDocsPage[] = [
  {
    kind: 'category',
    title: 'Theme',
    tabTitle: 'Theme',
    pages: ALL_THEME_PAGES,
  } as NgnDocsCategory,
  {
    kind: 'category',
    title: 'Components',
    tabTitle: 'Component',
    pages: ALL_COMPONENT_PAGES,
  } as NgnDocsCategory,
];
