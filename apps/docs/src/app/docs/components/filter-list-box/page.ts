import { JigDocsFilterListBoxPlayground } from './playground';
import { Demo_FilterListBox_Attributes } from '../../../demos/filter-list-box/attributes';
import { Demo_FilterListBox_Base } from '../../../demos/filter-list-box/base';
import { Demo_FilterListBox_EmptyState } from '../../../demos/filter-list-box/empty-state';
import { Demo_FilterListBox_Grouped } from '../../../demos/filter-list-box/grouped';
import { Demo_FilterListBox_ServerSide } from '../../../demos/filter-list-box/server-side';
import { i18nKeys } from '../../../utils/i18n-doc';

import type { JigDocsPage } from '../../../utils/page/types';

export const FilterListBoxPage: JigDocsPage = {
  title: `Filter List Box`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/filter-list-box/index.md',
      components: [
        Demo_FilterListBox_Base,
        Demo_FilterListBox_Attributes,
        Demo_FilterListBox_ServerSide,
        Demo_FilterListBox_Grouped,
        Demo_FilterListBox_EmptyState,
      ],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: JigDocsFilterListBoxPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/filter-list-box/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/filter-list-box/a11y.md' },
    i18nKeys(
      'filterListBox',
      {
        search: 'Accessible label for the search field.',
        activeFilters: 'Accessible label for the group of active condition chips.',
        clearAllFilters:
          'Label for the empty-state action that clears the search and every condition.',
        openFilter:
          'Accessible label for the filter trigger. The active condition count is appended in parentheses.',
      },
      ['attribute-filter', 'list-box']
    ),
  ],
};
