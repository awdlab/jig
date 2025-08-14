import { NgDocPage } from '@ng-doc/core';

import { Demo_Splitter_Base } from '../../../app/demos/splitter/base';
import { Demo_Splitter_MinMax } from '../../../app/demos/splitter/min-max';
import { Demo_Splitter_Reorder } from '../../../app/demos/splitter/reorder';
import { Demo_Splitter_State } from '../../../app/demos/splitter/state';
import { Demo_Splitter_Vertical } from '../../../app/demos/splitter/vertical';
import ComponentsCategory from '../../categories/components/ng-doc.category';

const SplitterPage: NgDocPage = {
  title: `Splitter`,
  mdFile: ['./index.md', './api.md', './playground.md'],
  category: ComponentsCategory,
  demos: {
    Demo_Splitter_Base,
    Demo_Splitter_MinMax,
    Demo_Splitter_Reorder,
    Demo_Splitter_State,
    Demo_Splitter_Vertical,
  },
  // playgrounds: {
  //   SplitterPlayground: {
  //     target: NgnSplitter,
  //     template: `<ngn-splitter ng-doc-selector style="height: 200px;">
  //       <div>Panel 1</div>
  //       <div>Panel 2</div>
  //     </ngn-splitter>`,
  //   },
  // },
};

export default SplitterPage;
