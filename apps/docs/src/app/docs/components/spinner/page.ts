import { NgnDocsSpinnerPlayground } from './playground';
import { Demo_Spinner_Base } from '../../../demos/spinner/base';
import { Demo_Spinner_Colors } from '../../../demos/spinner/colors';
import { Demo_Spinner_Creator } from '../../../demos/spinner/creator';
import { Demo_Spinner_Sizes } from '../../../demos/spinner/sizes';
import { Demo_Spinner_Thickness } from '../../../demos/spinner/thickness';
import { i18nNone } from '../../../utils/i18n-doc';

import type { NgnDocsPage } from '../../../utils/page/types';

export const SpinnerPage: NgnDocsPage = {
  title: `Spinner`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/spinner/index.md',
      components: [
        Demo_Spinner_Base,
        Demo_Spinner_Sizes,
        Demo_Spinner_Thickness,
        Demo_Spinner_Colors,
        Demo_Spinner_Creator,
      ],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: NgnDocsSpinnerPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/spinner/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/spinner/a11y.md' },
    i18nNone(),
  ],
};
