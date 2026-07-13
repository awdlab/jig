import { NgnDocsNumberInputPlayground } from './playground';
import { Demo_NumberInput_Base } from '../../../demos/number-input/base';
import { Demo_NumberInput_Locale } from '../../../demos/number-input/locale';
import { Demo_NumberInput_Steps } from '../../../demos/number-input/steps';
import { Demo_NumberInput_Validation } from '../../../demos/number-input/validation';
import { i18nText } from '../../../utils/i18n-doc';

import type { NgnDocsPage } from '../../../utils/page/types';

export const NumberInputPage: NgnDocsPage = {
  title: `Number Input`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/number-input/index.md',
      components: [
        Demo_NumberInput_Base,
        Demo_NumberInput_Validation,
        Demo_NumberInput_Locale,
        Demo_NumberInput_Steps,
      ],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: NgnDocsNumberInputPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/number-input/api.md' },
    {
      kind: 'single',
      title: 'Spin Buttons API',
      mdFile: 'components/number-input/spin-buttons-api.md',
    },
    { kind: 'single', title: 'Accessibility', mdFile: 'components/number-input/a11y.md' },
    i18nText(
      "Number Input has no built-in translatable strings of its own. Any text it exposes — the accessible `label` (used as the `aria-label`) and the native `placeholder` you set on the element — comes from the values you provide, so translate those in your own application's i18n layer. Its numeric display is formatted for the configured `locale` via `Intl.NumberFormat`, which is locale-aware formatting rather than string translation."
    ),
  ],
};
