import { NgnDocsSplitterPlayground } from './playground';
import { Demo_Splitter_Base } from '../../../demos/splitter/base';
import { Demo_Splitter_MinMax } from '../../../demos/splitter/min-max';
import { Demo_Splitter_Reorder } from '../../../demos/splitter/reorder';
import { Demo_Splitter_State } from '../../../demos/splitter/state';
import { Demo_Splitter_Vertical } from '../../../demos/splitter/vertical';
import { NgnDocsPage } from '../../../utils/page/types';

export const SplitterPage: NgnDocsPage = {
  title: `Splitter`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/splitter/index.md',
      components: [
        Demo_Splitter_Base,
        Demo_Splitter_MinMax,
        Demo_Splitter_Reorder,
        Demo_Splitter_State,
        Demo_Splitter_Vertical,
      ],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: NgnDocsSplitterPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/splitter/api.md' },
  ],
};
