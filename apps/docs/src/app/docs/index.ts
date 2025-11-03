import { ALL_COMPONENT_PAGES } from './components';
import { NgnDocsCategory, NgnDocsPage } from '../utils/page/types';

export const ALL_DOCS_PAGES: NgnDocsPage[] = [
  {
    kind: 'category',
    title: 'Components',
    pages: ALL_COMPONENT_PAGES,
  } as NgnDocsCategory,
];
