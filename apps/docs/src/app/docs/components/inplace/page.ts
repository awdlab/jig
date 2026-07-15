import { NgnDocsInplacePlayground } from './playground';
import { Demo_Inplace_Base } from '../../../demos/inplace/base';
import { Demo_Inplace_Lazy } from '../../../demos/inplace/lazy';
import { Demo_Inplace_Toggling } from '../../../demos/inplace/toggling';
import { i18nNone } from '../../../utils/i18n-doc';

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
      components: [Demo_Inplace_Base, Demo_Inplace_Toggling, Demo_Inplace_Lazy],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: NgnDocsInplacePlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/inplace/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/inplace/a11y.md' },
    i18nNone({ projection: true }),
  ],
};
