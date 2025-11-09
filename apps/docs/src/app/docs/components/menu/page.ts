import { Demo_Menu_Base } from '../../../demos/menu/base';
import { Demo_Menu_ContextMenu } from '../../../demos/menu/context-menu';
import { NgnDocsPage } from '../../../utils/page/types';

export const MenuPage: NgnDocsPage = {
  title: `Menu`,
  kind: 'tabs',
  tabs: [
    {
      default: true,
      title: 'Features',
      mdFile: 'components/menu/index.md',
      components: [Demo_Menu_Base, Demo_Menu_ContextMenu],
    },
    {
      title: 'API',
      mdFile: 'components/menu/api.md',
    },
  ],
};
