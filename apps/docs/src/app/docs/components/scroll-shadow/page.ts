import { Demo_ScrollShadow_Both } from '../../../demos/scroll-shadow/both';
import { Demo_ScrollShadow_Horizontal } from '../../../demos/scroll-shadow/horizontal';
import { Demo_ScrollShadow_Vertical } from '../../../demos/scroll-shadow/vertical';
import { i18nNone } from '../../../utils/i18n-doc';

import type { JigDocsPage } from '../../../utils/page/types';

export const ScrollShadowPage: JigDocsPage = {
  title: `Scroll Shadow`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/scroll-shadow/index.md',
      components: [
        Demo_ScrollShadow_Horizontal,
        Demo_ScrollShadow_Vertical,
        Demo_ScrollShadow_Both,
      ],
    },
    { kind: 'single', title: 'API', mdFile: 'components/scroll-shadow/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/scroll-shadow/a11y.md' },
    i18nNone(),
  ],
};
