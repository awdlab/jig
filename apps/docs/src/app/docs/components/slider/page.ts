import { JigDocsSliderPlayground } from './playground';
import { Demo_Slider_Base } from '../../../demos/slider/base';
import { Demo_Slider_MinMax } from '../../../demos/slider/min-max';
import { Demo_Slider_Range } from '../../../demos/slider/range';
import { Demo_Slider_States } from '../../../demos/slider/states';
import { Demo_Slider_Validation } from '../../../demos/slider/validation';
import { Demo_Slider_Vertical } from '../../../demos/slider/vertical';
import { i18nText } from '../../../utils/i18n-doc';

import type { JigDocsPage } from '../../../utils/page/types';

export const SliderPage: JigDocsPage = {
  title: `Slider`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/slider/index.md',
      components: [
        Demo_Slider_Base,
        Demo_Slider_Validation,
        Demo_Slider_MinMax,
        Demo_Slider_Range,
        Demo_Slider_Vertical,
        Demo_Slider_States,
      ],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: JigDocsSliderPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/slider/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/slider/a11y.md' },
    i18nText(
      "Slider only exposes translatable strings in `range` mode, where each handle needs its own accessible name: `slider.rangeStart` and `slider.rangeEnd`. Everything else it announces — the accessible `label` and the value text you provide via `valueText` or `valueTextFn` (used as `aria-valuetext`) — comes from the values you pass in, so translate those in your own application's i18n layer."
    ),
  ],
};
