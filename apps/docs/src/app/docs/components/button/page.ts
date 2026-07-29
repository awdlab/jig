import { NgnDocsButtonPlayground } from './playground';
import { Demo_Button_Action } from '../../../demos/button/action';
import { Demo_Button_Base } from '../../../demos/button/base';
import { Demo_Button_Disabled } from '../../../demos/button/disabled';
import { Demo_Button_Inline } from '../../../demos/button/inline';
import { Demo_Button_Kind } from '../../../demos/button/kind';
import { Demo_Button_Link } from '../../../demos/button/link';
import { i18nText } from '../../../utils/i18n-doc';

import type { NgnDocsPage } from '../../../utils/page/types';

export const ButtonPage: NgnDocsPage = {
  title: `Button`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/button/index.md',
      components: [
        Demo_Button_Base,
        Demo_Button_Kind,
        Demo_Button_Link,
        Demo_Button_Inline,
        Demo_Button_Disabled,
        Demo_Button_Action,
      ],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: NgnDocsButtonPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/button/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/button/a11y.md' },
    i18nText(
      "Button has no built-in translatable strings of its own. Any text it displays — the label content you place inside the `<button ngnButton>` (or `<a ngnButton>`) element — comes from the values you provide, so translate those in your own application's i18n layer."
    ),
  ],
};
