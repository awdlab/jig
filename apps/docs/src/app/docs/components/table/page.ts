import { Demo_Table_Base } from '../../../demos/table/base';
import { NgnDocsPage } from '../../../utils/page/types';

export const TablePage: NgnDocsPage = {
  title: `Table`,
  kind: 'tabs',
  tabs: [
    {
      default: true,
      title: 'Features',
      mdFile: 'components/table/index.md',
      components: [Demo_Table_Base],
    },
    {
      title: 'API',
      mdFile: 'components/table/api.md',
    },
  ],
};
