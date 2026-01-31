import { NgnDocsScrollerPlayground } from './playground';
import { Demo_Scroller_Base } from '../../../demos/scroller/base';
import { Demo_Scroller_Sticky } from '../../../demos/scroller/sticky';
import { Demo_Scroller_Virtual } from '../../../demos/scroller/virtual';
import { NgnDocsPage } from '../../../utils/page/types';

export const ScrollerPage: NgnDocsPage = {
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
      component: NgnDocsScrollerPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/scroller/api.md' },
  ],
};
