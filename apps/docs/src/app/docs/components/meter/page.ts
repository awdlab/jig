import { JigDocsMeterPlayground } from './playground';
import { Demo_Meter_Base } from '../../../demos/meter/base';
import { Demo_Meter_Colors } from '../../../demos/meter/colors';
import { Demo_Meter_Icons } from '../../../demos/meter/icons';
import { Demo_Meter_Percentages } from '../../../demos/meter/percentages';
import { Demo_Meter_Remaining } from '../../../demos/meter/remaining';
import { Demo_Meter_Templates } from '../../../demos/meter/templates';
import { Demo_Meter_Total } from '../../../demos/meter/total';
import { Demo_Meter_Vertical } from '../../../demos/meter/vertical';
import { i18nNone } from '../../../utils/i18n-doc';

import type { JigDocsPage } from '../../../utils/page/types';

export const MeterPage: JigDocsPage = {
  title: `Meter`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/meter/index.md',
      components: [
        Demo_Meter_Base,
        Demo_Meter_Total,
        Demo_Meter_Remaining,
        Demo_Meter_Icons,
        Demo_Meter_Colors,
        Demo_Meter_Vertical,
        Demo_Meter_Percentages,
        Demo_Meter_Templates,
      ],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: JigDocsMeterPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/meter/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/meter/a11y.md' },
    i18nNone(),
  ],
};
