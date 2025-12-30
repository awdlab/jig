import { Demo_ItemView_Base } from '../../../demos/item-view/base';
import { Demo_ItemView_Freeze } from '../../../demos/item-view/freeze';
import { Demo_ItemView_Separator } from '../../../demos/item-view/separator';
import { Demo_ItemView_Strategies } from '../../../demos/item-view/strategies';
import { NgnDocsPage } from '../../../utils/page/types';

export const ItemViewPage: NgnDocsPage = {
  title: `ItemView`,
  kind: 'tabs',
  tabs: [
    {
      default: true,
      title: 'Features',
      mdFile: 'components/item-view/index.md',
      components: [
        Demo_ItemView_Base,
        Demo_ItemView_Separator,
        Demo_ItemView_Freeze,
        Demo_ItemView_Strategies,
      ],
    },
    {
      title: 'API',
      mdFile: 'components/item-view/api.md',
    },
  ],
};
