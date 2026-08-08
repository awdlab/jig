import { Demo_Movable_Base } from '../../../demos/movable/base';
import { Demo_Movable_Handle } from '../../../demos/movable/handle';
import { i18nNone } from '../../../utils/i18n-doc';

import type { NgnDocsPage } from '../../../utils/page/types';

export const MovablePage: NgnDocsPage = {
  title: `Movable`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/movable/index.md',
      components: [Demo_Movable_Base, Demo_Movable_Handle],
    },
    { kind: 'single', title: 'API', mdFile: 'components/movable/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/movable/a11y.md' },
    i18nNone(),
  ],
};
