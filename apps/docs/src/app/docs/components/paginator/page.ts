import { NgnDocsPaginatorPlayground } from './playground';
import { Demo_Paginator_Base } from '../../../demos/paginator/base';
import { Demo_Paginator_Overflow } from '../../../demos/paginator/overflow';
import { Demo_Paginator_Pagesize } from '../../../demos/paginator/pagesize';
import { i18nKeys } from '../../../utils/i18n-doc';

import type { NgnDocsPage } from '../../../utils/page/types';

export const PaginatorPage: NgnDocsPage = {
  title: `Paginator`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/paginator/index.md',
      components: [Demo_Paginator_Base, Demo_Paginator_Overflow, Demo_Paginator_Pagesize],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: NgnDocsPaginatorPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/paginator/api.md' },
    { kind: 'single', title: 'Accessibility', mdFile: 'components/paginator/a11y.md' },
    i18nKeys('paginator', {
      previousPage: 'Accessible label for the control that navigates to the previous page.',
      nextPage: 'Accessible label for the control that navigates to the next page.',
    }),
  ],
};
