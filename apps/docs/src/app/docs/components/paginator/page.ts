import { Demo_Paginator_Base } from '../../../demos/paginator/base';
import { NgnDocsPage } from '../../../utils/page/types';

export const PaginatorPage: NgnDocsPage = {
  title: `Paginator`,
  kind: 'tabs',
  tabs: [
    {
      default: true,
      title: 'Features',
      mdFile: 'components/paginator/index.md',
      components: [Demo_Paginator_Base],
    },
    {
      title: 'API',
      mdFile: 'components/paginator/api.md',
    },
  ],
};
