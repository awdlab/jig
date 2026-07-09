import { NgnDocsMaskInputPlayground } from './playground';
import { Demo_MaskInput_Base } from '../../../demos/mask-input/base';
import { Demo_MaskInput_Date } from '../../../demos/mask-input/date';
import { Demo_MaskInput_Time12 } from '../../../demos/mask-input/time12';
import { Demo_MaskInput_Validation } from '../../../demos/mask-input/validation';

import type { NgnDocsPage } from '../../../utils/page/types';

export const MaskInputPage: NgnDocsPage = {
  title: `Mask Input`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/mask-input/index.md',
      components: [
        Demo_MaskInput_Base,
        Demo_MaskInput_Validation,
        Demo_MaskInput_Time12,
        Demo_MaskInput_Date,
      ],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: NgnDocsMaskInputPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/mask-input/api.md' },
  ],
};
