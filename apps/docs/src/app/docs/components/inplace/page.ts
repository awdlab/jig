import { NgnDocsInplacePlayground } from './playground';
import { Demo_Inplace_Base } from '../../../demos/inplace/base';

import type { NgnDocsPage } from '../../../utils/page/types';

export const InplacePage: NgnDocsPage = {
  title: `Inplace`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/inplace/index.md',
      components: [Demo_Inplace_Base],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: NgnDocsInplacePlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/inplace/api.md' },
  ],
};
