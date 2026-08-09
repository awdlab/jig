import { AwdDocsDrawerPlayground } from './playground';
import { Demo_Drawer_Base } from '../../../demos/drawer/base';
import { Demo_Drawer_Position } from '../../../demos/drawer/position';
import { i18nKeys } from '../../../utils/i18n-doc';

import type { AwdDocsPage } from '../../../utils/page/types';

export const DrawerPage: AwdDocsPage = {
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
      component: AwdDocsDrawerPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/drawer/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/drawer/a11y.md' },
    i18nKeys('drawer', {
      close: 'Accessible label for the close button in the drawer header.',
    }),
  ],
};
