import { NgnDocsTabsPlayground } from './playground';
import { Demo_Tabs_Base } from '../../../demos/tabs/base';
import { Demo_Tabs_CustomHeader } from '../../../demos/tabs/custom-header';
import { Demo_Tabs_Dynamic } from '../../../demos/tabs/dynamic';
import { Demo_Tabs_Navigation } from '../../../demos/tabs/navigation';
import { i18nText } from '../../../utils/i18n-doc';

import type { NgnDocsPage } from '../../../utils/page/types';

export const TabsPage: NgnDocsPage = {
  title: `Tabs`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/tabs/index.md',
      components: [Demo_Tabs_Base, Demo_Tabs_Dynamic, Demo_Tabs_CustomHeader, Demo_Tabs_Navigation],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: NgnDocsTabsPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/tabs/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/tabs/a11y.md' },
    i18nText(
      "Tabs has no built-in translatable strings of its own. Any text it displays — the tab header labels and panel content you project through each `ngn-tab` — comes from the values you provide, so translate those in your own application's i18n layer."
    ),
  ],
};
