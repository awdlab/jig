import { AwdDocsScrollerPlayground } from './playground';
import { Demo_Scroller_Base } from '../../../demos/scroller/base';
import { Demo_Scroller_Sticky } from '../../../demos/scroller/sticky';
import { Demo_Scroller_Virtual } from '../../../demos/scroller/virtual';
import { i18nNone } from '../../../utils/i18n-doc';

import type { AwdDocsPage } from '../../../utils/page/types';

export const ScrollerPage: AwdDocsPage = {
  title: `Scroller`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/scroller/index.md',
      components: [Demo_Scroller_Base, Demo_Scroller_Sticky, Demo_Scroller_Virtual],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: AwdDocsScrollerPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/scroller/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/scroller/a11y.md' },
    i18nNone(),
  ],
};
