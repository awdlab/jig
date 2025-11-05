import { Demo_ItemView_Base } from '../../../demos/item-view/base';
import { NgnDocsPage } from '../../../utils/page/types';

export const ItemViewPage: NgnDocsPage = {
  title: `ItemView`,
  kind: 'tabs',
  tabs: [
    {
      default: true,
      title: 'Features',
      mdFile: 'components/item-view/index.md',
      components: [Demo_ItemView_Base],
    },
    {
      title: 'API',
      mdFile: 'components/item-view/api.md',
    },
  ],
};
