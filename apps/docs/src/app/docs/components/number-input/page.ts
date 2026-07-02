import { NgnDocsNumberInputPlayground } from './playground';
import { Demo_NumberInput_Base } from '../../../demos/number-input/base';
import { Demo_NumberInput_Locale } from '../../../demos/number-input/locale';
import { Demo_NumberInput_Steps } from '../../../demos/number-input/steps';

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
      components: [Demo_NumberInput_Base, Demo_NumberInput_Locale, Demo_NumberInput_Steps],
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
  ],
};
