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
      default: true,
      title: 'Features',
      mdFile: 'components/scroller/index.md',
      components: [Demo_Scroller_Base, Demo_Scroller_Sticky, Demo_Scroller_Virtual],
    },
    {
      title: 'Playground',
      mdFile: 'components/scroller/playground.md',
      components: [NgnDocsScrollerPlayground],
    },
    {
      title: 'API',
      mdFile: 'components/scroller/api.md',
    },
  ],
};
