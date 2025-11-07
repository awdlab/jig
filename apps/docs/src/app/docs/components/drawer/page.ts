import { Demo_Drawer_Base } from '../../../demos/drawer/base';
import { NgnDocsPage } from '../../../utils/page/types';

export const DrawerPage: NgnDocsPage = {
  title: `Drawer`,
  kind: 'tabs',
  tabs: [
    {
      default: true,
      title: 'Features',
      mdFile: 'components/drawer/index.md',
      components: [Demo_Drawer_Base],
    },
    {
      title: 'API',
      mdFile: 'components/drawer/api.md',
    },
  ],
};
