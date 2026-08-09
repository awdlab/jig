import { AwdDocsMenuPlayground } from './playground';
import { Demo_Menu_Base } from '../../../demos/menu/base';
import { Demo_Menu_ContextMenu } from '../../../demos/menu/context-menu';
import { Demo_Menu_Popover } from '../../../demos/menu/popover';
import { Demo_Menu_Separator } from '../../../demos/menu/separator';
import { Demo_Menu_Tiered } from '../../../demos/menu/tiered';
import { i18nText } from '../../../utils/i18n-doc';

import type { AwdDocsPage } from '../../../utils/page/types';

export const MenuPage: AwdDocsPage = {
  title: `Menu`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
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
      kind: 'component',
      title: 'Playground',
      component: AwdDocsMenuPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/menu/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/menu/a11y.md' },
    i18nText(
      "Menu has no built-in translatable strings of its own. Any text it displays — the `label` of each item in the `items` array — comes from the values you provide, so translate those in your own application's i18n layer."
    ),
  ],
};
