import { NgnDocsInputPlayground } from './playground';
import { Demo_Input_Base } from '../../../demos/input/base';
import { Demo_Input_States } from '../../../demos/input/states';
import { Demo_Input_Textarea } from '../../../demos/input/textarea';
import { Demo_Input_Validation } from '../../../demos/input/validation';
import { i18nText } from '../../../utils/i18n-doc';

import type { NgnDocsPage } from '../../../utils/page/types';

export const InputPage: NgnDocsPage = {
  title: `Input`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/input/index.md',
      components: [Demo_Input_Base, Demo_Input_Validation, Demo_Input_States, Demo_Input_Textarea],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: NgnDocsInputPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/input/api.md' },
    { kind: 'single', title: 'Accessibility', mdFile: 'components/input/a11y.md' },
    i18nText(
      "Input has no built-in translatable strings of its own. Any text it displays — the value the user types and the native `placeholder` attribute you set on the element — comes from the values you provide, so translate those in your own application's i18n layer."
    ),
  ],
};
