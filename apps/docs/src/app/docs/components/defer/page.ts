import { Demo_Defer_Base } from '../../../demos/defer/base';
import { i18nNone } from '../../../utils/i18n-doc';

import type { NgnDocsPage } from '../../../utils/page/types';

export const DeferPage: NgnDocsPage = {
  title: `Defer`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/defer/index.md',
      components: [Demo_Defer_Base],
    },
    { kind: 'single', title: 'API', mdFile: 'components/defer/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/defer/a11y.md' },
    i18nNone({ projection: true }),
  ],
};
