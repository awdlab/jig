import { NgnDocsCheckboxPlayground } from './playground';
import { Demo_Checkbox_Base } from '../../../demos/checkbox/base';
import { Demo_Checkbox_Indeterminate } from '../../../demos/checkbox/indeterminate';
import { Demo_Checkbox_States } from '../../../demos/checkbox/states';
import { Demo_Checkbox_Validation } from '../../../demos/checkbox/validation';
import { i18nText } from '../../../utils/i18n-doc';

import type { NgnDocsPage } from '../../../utils/page/types';

export const CheckboxPage: NgnDocsPage = {
  title: `Checkbox`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/checkbox/index.md',
      components: [
        Demo_Checkbox_Base,
        Demo_Checkbox_Validation,
        Demo_Checkbox_Indeterminate,
        Demo_Checkbox_States,
      ],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: NgnDocsCheckboxPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/checkbox/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/checkbox/a11y.md' },
    i18nText(
      "Checkbox has no built-in translatable strings of its own. Any text it exposes — the accessible `label` you supply (used as the `aria-label`) — comes from the values you provide, so translate those in your own application's i18n layer."
    ),
  ],
};
