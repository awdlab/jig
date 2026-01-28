import { NgnDocsTablePlayground } from './playground';
import { Demo_Table_Base } from '../../../demos/table/base';
import { Demo_Table_Filtering } from '../../../demos/table/filtering';
import { Demo_Table_Paged } from '../../../demos/table/paged';
import { Demo_Table_Sorting } from '../../../demos/table/sorting';
import { Demo_Table_Virtual } from '../../../demos/table/virtual';
import { NgnDocsPage } from '../../../utils/page/types';

export const TablePage: NgnDocsPage = {
  title: `Table`,
  kind: 'tabs',
  tabs: [
    {
      default: true,
      title: 'Features',
      mdFile: 'components/table/index.md',
      components: [
        Demo_Table_Base,
        Demo_Table_Filtering,
        Demo_Table_Paged,
        Demo_Table_Sorting,
        Demo_Table_Virtual,
      ],
    },
    {
      title: 'Playground',
      mdFile: 'components/table/playground.md',
      components: [NgnDocsTablePlayground],
    },
    {
      title: 'API',
      mdFile: 'components/table/api.md',
    },
  ],
};
