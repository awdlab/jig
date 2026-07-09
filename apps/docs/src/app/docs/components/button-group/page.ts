import { NgnDocsButtonGroupPlayground } from './playground';
import { Demo_ButtonGroup_Base } from '../../../demos/button-group/base';
import { Demo_ButtonGroup_Toggle } from '../../../demos/button-group/toggle';

import type { NgnDocsPage } from '../../../utils/page/types';

export const ButtonGroupPage: NgnDocsPage = {
  title: `Button Group`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/button-group/index.md',
      components: [Demo_ButtonGroup_Base, Demo_ButtonGroup_Toggle],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: NgnDocsButtonGroupPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/button-group/api.md' },
  ],
};
