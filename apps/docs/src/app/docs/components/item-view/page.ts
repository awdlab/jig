import { NgnDocsItemViewPlayground } from './playground';
import { Demo_ItemView_Base } from '../../../demos/item-view/base';
import { Demo_ItemView_Freeze } from '../../../demos/item-view/freeze';
import { Demo_ItemView_Separator } from '../../../demos/item-view/separator';
import { Demo_ItemView_Strategies } from '../../../demos/item-view/strategies';

import type { NgnDocsPage } from '../../../utils/page/types';

export const ItemViewPage: NgnDocsPage = {
  title: `ItemView`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/item-view/index.md',
      components: [
        Demo_ItemView_Base,
        Demo_ItemView_Separator,
        Demo_ItemView_Freeze,
        Demo_ItemView_Strategies,
      ],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: NgnDocsItemViewPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/item-view/api.md' },
  ],
};
