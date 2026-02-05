import { NgnDocsDrawerPlayground } from './playground';
import { Demo_Drawer_Base } from '../../../demos/drawer/base';
import { Demo_Drawer_Position } from '../../../demos/drawer/position';

import type { NgnDocsPage } from '../../../utils/page/types';

export const DrawerPage: NgnDocsPage = {
  title: `Drawer`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/drawer/index.md',
      components: [Demo_Drawer_Base, Demo_Drawer_Position],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: NgnDocsDrawerPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/drawer/api.md' },
  ],
};
