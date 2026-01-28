import { NgnDocsMenuPlayground } from './playground';
import { Demo_Menu_Base } from '../../../demos/menu/base';
import { Demo_Menu_ContextMenu } from '../../../demos/menu/context-menu';
import { Demo_Menu_Popover } from '../../../demos/menu/popover';
import { Demo_Menu_Separator } from '../../../demos/menu/separator';
import { Demo_Menu_Tiered } from '../../../demos/menu/tiered';
import { NgnDocsPage } from '../../../utils/page/types';

export const MenuPage: NgnDocsPage = {
  title: `Menu`,
  kind: 'tabs',
  tabs: [
    {
      default: true,
      title: 'Features',
      mdFile: 'components/menu/index.md',
      components: [
        Demo_Menu_Base,
        Demo_Menu_ContextMenu,
        Demo_Menu_Popover,
        Demo_Menu_Separator,
        Demo_Menu_Tiered,
      ],
    },
    {
      title: 'Playground',
      mdFile: 'components/menu/playground.md',
      components: [NgnDocsMenuPlayground],
    },
    {
      title: 'API',
      mdFile: 'components/menu/api.md',
    },
  ],
};
