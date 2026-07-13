import { NgnDocsRadioPlayground } from './playground';
import { Demo_Radio_Base } from '../../../demos/radio/base';
import { Demo_Radio_Orientation } from '../../../demos/radio/orientation';
import { Demo_Radio_States } from '../../../demos/radio/states';
import { Demo_Radio_Validation } from '../../../demos/radio/validation';
import { i18nText } from '../../../utils/i18n-doc';

import type { NgnDocsPage } from '../../../utils/page/types';

export const RadioPage: NgnDocsPage = {
  title: `Radio`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/radio/index.md',
      components: [
        Demo_Radio_Base,
        Demo_Radio_Validation,
        Demo_Radio_Orientation,
        Demo_Radio_States,
      ],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: NgnDocsRadioPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/radio/api.md' },
    { kind: 'single', title: 'Accessibility', mdFile: 'components/radio/a11y.md' },
    i18nText(
      "Radio has no built-in translatable strings of its own. Any text it displays — each option's projected label content (or its `label` fallback input) — comes from the values you provide, so translate those in your own application's i18n layer."
    ),
  ],
};
