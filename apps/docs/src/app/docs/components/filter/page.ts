import { NgnDocsFilterPlayground } from './playground';
import { Demo_Filter_ApplyMode } from '../../../demos/filter/apply-mode';
import { Demo_Filter_Base } from '../../../demos/filter/base';
import { Demo_Filter_Custom } from '../../../demos/filter/custom';
import { Demo_Filter_DataTypes } from '../../../demos/filter/datatypes';
import { Demo_Filter_Headless } from '../../../demos/filter/headless';
import { Demo_Filter_Inline } from '../../../demos/filter/inline';
import { Demo_Filter_Multiple } from '../../../demos/filter/multiple';
import { Demo_Filter_Validation } from '../../../demos/filter/validation';

import type { NgnDocsPage } from '../../../utils/page/types';

export const FilterPage: NgnDocsPage = {
  title: `Filter`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/filter/index.md',
      components: [
        Demo_Filter_Base,
        Demo_Filter_Validation,
        Demo_Filter_Inline,
        Demo_Filter_Headless,
        Demo_Filter_DataTypes,
        Demo_Filter_Custom,
        Demo_Filter_Multiple,
        Demo_Filter_ApplyMode,
      ],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: NgnDocsFilterPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/filter/api.md' },
  ],
};
