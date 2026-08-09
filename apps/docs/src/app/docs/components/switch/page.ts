import { JigDocsSwitchPlayground } from './playground';
import { Demo_Switch_Base } from '../../../demos/switch/base';
import { Demo_Switch_States } from '../../../demos/switch/states';
import { Demo_Switch_Validation } from '../../../demos/switch/validation';
import { i18nText } from '../../../utils/i18n-doc';

import type { JigDocsPage } from '../../../utils/page/types';

export const SwitchPage: JigDocsPage = {
  title: `Switch`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/switch/index.md',
      components: [Demo_Switch_Base, Demo_Switch_Validation, Demo_Switch_States],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: JigDocsSwitchPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/switch/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/switch/a11y.md' },
    i18nText(
      "Switch has no built-in translatable strings of its own. Any text it exposes — the accessible `label` you supply (used as the `aria-label`) — comes from the values you provide, so translate those in your own application's i18n layer."
    ),
  ],
};
