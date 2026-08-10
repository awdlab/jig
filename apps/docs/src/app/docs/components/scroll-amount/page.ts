import { Demo_ScrollAmount_Base } from '../../../demos/scroll-amount/base';
import { Demo_ScrollAmount_Infinite } from '../../../demos/scroll-amount/infinite';
import { i18nNone } from '../../../utils/i18n-doc';

import type { JigDocsPage } from '../../../utils/page/types';

export const ScrollAmountPage: JigDocsPage = {
  title: `Scroll Amount`,
  source: 'directives/scroll-amount.ts',
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/scroll-amount/index.md',
      components: [Demo_ScrollAmount_Base, Demo_ScrollAmount_Infinite],
    },
    { kind: 'single', title: 'API', mdFile: 'components/scroll-amount/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/scroll-amount/a11y.md' },
    i18nNone(),
  ],
};
