import { NgnDocsTablePlayground } from './playground';
import { Demo_Table_Base } from '../../../demos/table/base';
import { Demo_Table_Filtering } from '../../../demos/table/filtering';
import { Demo_Table_Grouping } from '../../../demos/table/grouping';
import { Demo_Table_Paged } from '../../../demos/table/paged';
import { Demo_Table_Reorderable } from '../../../demos/table/reorderable';
import { Demo_Table_Resizable } from '../../../demos/table/resizable';
import { Demo_Table_RowActions } from '../../../demos/table/row-actions';
import {
  Demo_Table_Selection_Multi,
  Demo_Table_Selection_Single,
} from '../../../demos/table/selection';
import { Demo_Table_Sorting } from '../../../demos/table/sorting';
import { Demo_Table_StickyColumns } from '../../../demos/table/sticky-columns';
import { Demo_Table_Virtual } from '../../../demos/table/virtual';
import { i18nKeys } from '../../../utils/i18n-doc';

import type { NgnDocsPage } from '../../../utils/page/types';

export const TablePage: NgnDocsPage = {
  title: `Table`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/table/index.md',
      components: [
        Demo_Table_Base,
        Demo_Table_Selection_Single,
        Demo_Table_Selection_Multi,
        Demo_Table_Filtering,
        Demo_Table_Grouping,
        Demo_Table_Paged,
        Demo_Table_Sorting,
        Demo_Table_Virtual,
        Demo_Table_Resizable,
        Demo_Table_Reorderable,
        Demo_Table_StickyColumns,
        Demo_Table_RowActions,
      ],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: NgnDocsTablePlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/table/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/table/a11y.md' },
    i18nKeys(
      'table',
      {
        selectAllRows:
          'Accessible label for the header checkbox that toggles selection of every row.',
        selectRow: 'Accessible label for the per-row selection checkbox.',
        sortedBy:
          'Screen-reader announcement of the active sort; interpolates {{ column }} with the column name and {{ direction }} with the sort direction.',
        sortAscending:
          'Direction word interpolated into the sort announcement when sorting ascending.',
        sortDescending:
          'Direction word interpolated into the sort announcement when sorting descending.',
        sortCleared: 'Screen-reader announcement when sorting is removed.',
        selectedCount:
          'Screen-reader announcement of selection size; interpolates {{ count }} and {{ total }} with the selected and total row counts.',
        page: 'Screen-reader announcement of the current page; interpolates {{ page }} and {{ pages }} with the current and total page numbers.',
        resultCount:
          'Screen-reader announcement of the row count; interpolates {{ count }} with the number of results.',
      },
      ['paginator']
    ),
  ],
};
