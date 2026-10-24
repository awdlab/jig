import { JigDocsFilterBarPlayground } from './playground';
import { Demo_FilterBar_Base } from '../../../demos/filter-bar/base';
import { Demo_FilterBar_Properties } from '../../../demos/filter-bar/properties';
import { Demo_FilterBar_WithListBox } from '../../../demos/filter-bar/with-list-box';
import { Demo_FilterBar_CustomTemplate } from '../../../demos/filter-bar/custom-template';
import { i18nKeys } from '../../../utils/i18n-doc';

import type { JigDocsPage } from '../../../utils/page/types';

export const FilterBarPage: JigDocsPage = {
  title: `Filter Bar`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/filter-bar/index.md',
      components: [
        Demo_FilterBar_Base,
        Demo_FilterBar_Properties,
        Demo_FilterBar_WithListBox,
        Demo_FilterBar_CustomTemplate,
      ],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: JigDocsFilterBarPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/filter-bar/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/filter-bar/a11y.md' },
    i18nKeys(
      'filterBar',
      {
        search: 'Accessible name of the search input.',
        activeFilters: 'Accessible name of the group holding the condition chips.',
        clearAllFilters: 'Label for a "clear all filters" action you render yourself.',
        openFilter: 'Accessible name of the filter trigger; the active count is appended.',
      },
      ['filterBuilder', 'filter']
    ),
  ],
};
