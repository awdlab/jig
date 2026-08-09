import { JigDocsProgressPlayground } from './playground';
import { Demo_Progress_Base } from '../../../demos/progress/base';
import { Demo_Progress_Circular } from '../../../demos/progress/circular';
import { Demo_Progress_CircularIndeterminate } from '../../../demos/progress/circular-indeterminate';
import { Demo_Progress_Indeterminate } from '../../../demos/progress/indeterminate';
import { Demo_Progress_Sizes } from '../../../demos/progress/sizes';
import { i18nNone } from '../../../utils/i18n-doc';

import type { JigDocsPage } from '../../../utils/page/types';

export const ProgressPage: JigDocsPage = {
  title: `Progress`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/progress/index.md',
      components: [
        Demo_Progress_Base,
        Demo_Progress_Indeterminate,
        Demo_Progress_Circular,
        Demo_Progress_CircularIndeterminate,
        Demo_Progress_Sizes,
      ],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: JigDocsProgressPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/progress/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/progress/a11y.md' },
    i18nNone(),
  ],
};
