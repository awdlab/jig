import { NgnDocsInputMaskPlayground } from './playground';
import { Demo_InputMask_Base } from '../../../demos/input-mask/base';

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
      components: [Demo_InputMask_Base],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: NgnDocsInputMaskPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/input-mask/api.md' },
  ],
};
