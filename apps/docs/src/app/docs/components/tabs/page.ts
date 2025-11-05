import { Demo_Tabs_Base } from '../../../demos/tabs/base';
import { Demo_Tabs_Dynamic } from '../../../demos/tabs/dynamic';
import { NgnDocsPage } from '../../../utils/page/types';

export const TabsPage: NgnDocsPage = {
  title: `Tabs`,
  kind: 'tabs',
  tabs: [
    {
      default: true,
      title: 'Features',
      mdFile: 'components/tabs/index.md',
      components: [Demo_Tabs_Base, Demo_Tabs_Dynamic],
    },
    {
      title: 'API',
      mdFile: 'components/tabs/api.md',
    },
  ],
};
