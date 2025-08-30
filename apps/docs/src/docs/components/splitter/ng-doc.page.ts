import { NgDocPage } from '@ng-doc/core';
import { NgnSplitterPanel } from '@ngneers/controls/splitter';

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
  imports: [NgnSplitterPanel],
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
  //     template: `<ng-doc-selector  style="height: 200px;">
  //       <ngn-splitter-panel [aria-label]="'First Panel'"> Panel 1 </ngn-splitter-panel>
  //       <ngn-splitter-panel  [aria-label]="'Second Panel'"> Panel 2 </ngn-splitter-panel>
  //       <ngn-splitter-panel [aria-label]="'Third Panel'"> Panel 3 </ngn-splitter-panel>
  //     </ng-doc-selector>`,
  //   },
  // },
};

export default SplitterPage;
