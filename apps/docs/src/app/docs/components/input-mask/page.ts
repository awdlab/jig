import { NgnDocsInputMaskPlayground } from './playground';
import { Demo_InputMask_Base } from '../../../demos/input-mask/base';
import { Demo_InputMask_Date } from '../../../demos/input-mask/date';
import { Demo_InputMask_Time12 } from '../../../demos/input-mask/time12';
import { Demo_InputMask_Validation } from '../../../demos/input-mask/validation';

import type { NgnDocsPage } from '../../../utils/page/types';

export const InputMaskPage: NgnDocsPage = {
  title: `Input Mask`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/input-mask/index.md',
      components: [
        Demo_InputMask_Base,
        Demo_InputMask_Validation,
        Demo_InputMask_Time12,
        Demo_InputMask_Date,
      ],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: NgnDocsInputMaskPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/input-mask/api.md' },
  ],
};
