import { NgnDocsKbdPlayground } from './playground';
import { Demo_Kbd_Base } from '../../../demos/kbd/base';
import { Demo_Kbd_DialogButtons } from '../../../demos/kbd/dialog-buttons';
import { Demo_Kbd_ShortcutScope } from '../../../demos/kbd/shortcut-scope';

import type { NgnDocsPage } from '../../../utils/page/types';

export const KbdPage: NgnDocsPage = {
  title: `Kbd`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,
      title: 'Examples',
      mdFile: 'components/kbd/index.md',
      components: [Demo_Kbd_Base, Demo_Kbd_ShortcutScope, Demo_Kbd_DialogButtons],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: NgnDocsKbdPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/kbd/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/kbd/a11y.md' },
  ],
};
