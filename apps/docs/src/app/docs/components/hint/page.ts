import { NgnDocsHintPlayground } from './playground';
import { Demo_Hint_Base } from '../../../demos/hint/base';
import { Demo_Hint_Template } from '../../../demos/hint/template';
import { Demo_Hint_WithIcon } from '../../../demos/hint/with-icon';
import { i18nText } from '../../../utils/i18n-doc';

import type { NgnDocsPage } from '../../../utils/page/types';

export const HintPage: NgnDocsPage = {
  title: `Hint`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/hint/index.md',
      components: [Demo_Hint_Base, Demo_Hint_WithIcon, Demo_Hint_Template],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: NgnDocsHintPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/hint/api.md' },
    { kind: 'single', title: 'Accessibility', mdFile: 'components/hint/a11y.md' },
    i18nText(
      "Hint has no built-in translatable strings of its own. Any text it displays — the `content` text (or the template/projected content you supply, including any validation `message` fed to it) — comes from the values you provide, so translate those in your own application's i18n layer."
    ),
  ],
};
