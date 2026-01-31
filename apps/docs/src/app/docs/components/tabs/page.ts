import { NgnDocsTabsPlayground } from './playground';
import { Demo_Tabs_Base } from '../../../demos/tabs/base';
import { Demo_Tabs_CustomHeader } from '../../../demos/tabs/custom-header';
import { Demo_Tabs_Dynamic } from '../../../demos/tabs/dynamic';
import { NgnDocsPage } from '../../../utils/page/types';

export const TabsPage: NgnDocsPage = {
  title: `Tabs`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/tabs/index.md',
      components: [Demo_Tabs_Base, Demo_Tabs_Dynamic, Demo_Tabs_CustomHeader],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: NgnDocsTabsPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/tabs/api.md' },
  ],
};
