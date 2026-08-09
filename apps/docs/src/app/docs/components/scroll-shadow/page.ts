import { Demo_Scroll_Shadow_Both } from '../../../demos/scroll-shadow/both';
import { Demo_Scroll_Shadow_Horizontal } from '../../../demos/scroll-shadow/horizontal';
import { Demo_Scroll_Shadow_Vertical } from '../../../demos/scroll-shadow/vertical';
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
        Demo_Scroll_Shadow_Horizontal,
        Demo_Scroll_Shadow_Vertical,
        Demo_Scroll_Shadow_Both,
      ],
    },
    { kind: 'single', title: 'API', mdFile: 'components/scroll-shadow/api.md' },
    i18nNone(),
  ],
};
