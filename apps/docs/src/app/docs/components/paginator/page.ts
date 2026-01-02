import { Demo_Paginator_Base } from '../../../demos/paginator/base';
import { Demo_Paginator_Overflow } from '../../../demos/paginator/overflow';
import { Demo_Paginator_Pagesize } from '../../../demos/paginator/pagesize';
import { NgnDocsPage } from '../../../utils/page/types';

export const PaginatorPage: NgnDocsPage = {
  title: `Paginator`,
  kind: 'tabs',
  tabs: [
    {
      default: true,
      title: 'Features',
      mdFile: 'components/paginator/index.md',
      components: [Demo_Paginator_Base, Demo_Paginator_Overflow, Demo_Paginator_Pagesize],
    },
    {
      title: 'API',
      mdFile: 'components/paginator/api.md',
    },
  ],
};
