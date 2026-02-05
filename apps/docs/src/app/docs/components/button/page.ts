import { NgnDocsButtonPlayground } from './playground';
import { Demo_Button_Base } from '../../../demos/button/base';
import { Demo_Button_Kind } from '../../../demos/button/kind';

import type { NgnDocsPage } from '../../../utils/page/types';

export const ButtonPage: NgnDocsPage = {
  title: `Button`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/button/index.md',
      components: [Demo_Button_Base, Demo_Button_Kind],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: NgnDocsButtonPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/button/api.md' },
  ],
};
