import { JigDocsFilterBuilderPlayground } from './playground';
import { Demo_FilterBuilder_ApplyMode } from '../../../demos/filter-builder/apply-mode';
import { Demo_FilterBuilder_Base } from '../../../demos/filter-builder/base';
import { Demo_FilterBuilder_DataTypes } from '../../../demos/filter-builder/datatypes';
import { Demo_FilterBuilder_Headless } from '../../../demos/filter-builder/headless';
import { Demo_FilterBuilder_Inline } from '../../../demos/filter-builder/inline';
import { Demo_FilterBuilder_Multiple } from '../../../demos/filter-builder/multiple';
import { Demo_FilterBuilder_CustomTemplate } from '../../../demos/filter-builder/custom-template';
import { i18nKeys } from '../../../utils/i18n-doc';

import type { JigDocsPage } from '../../../utils/page/types';

export const FilterBuilderPage: JigDocsPage = {
  title: `Filter Builder`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/filter-builder/index.md',
      components: [
        Demo_FilterBuilder_Base,
        Demo_FilterBuilder_Inline,
        Demo_FilterBuilder_Headless,
        Demo_FilterBuilder_DataTypes,
        Demo_FilterBuilder_Multiple,
        Demo_FilterBuilder_CustomTemplate,
        Demo_FilterBuilder_ApplyMode,
      ],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: JigDocsFilterBuilderPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/filter-builder/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/filter-builder/a11y.md' },
    i18nKeys(
      'filterBuilder',
      {
        property: 'Label for the select that picks which property a condition filters on.',
        chip: 'Template for a condition chip with a value. Receives property, operator and value.',
        chipNoValue:
          'Template for a condition chip whose operator takes no value. Receives property and operator.',
      },
      ['filter', 'calendar']
    ),
  ],
};
