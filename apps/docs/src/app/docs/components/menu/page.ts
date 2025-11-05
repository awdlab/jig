import { Demo_Menu_Base } from '../../../demos/menu/base';
import { NgnDocsPage } from '../../../utils/page/types';

export const MenuPage: NgnDocsPage = {
  title: `Menu`,
  kind: 'tabs',
  tabs: [
    {
      default: true,
      title: 'Features',
      mdFile: 'components/menu/index.md',
      components: [Demo_Menu_Base],
    },
    {
      title: 'API',
      mdFile: 'components/menu/api.md',
    },
  ],
};
