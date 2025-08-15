import { NgDocPage } from '@ng-doc/core';
import { NgnScroller } from '@ngneers/controls/scroller';

import { Demo_Scroller_Base } from '../../../app/demos/scroller/base';
import { Demo_Scroller_Sticky } from '../../../app/demos/scroller/sticky';
import { Demo_Scroller_Virtual } from '../../../app/demos/scroller/virtual';
import ComponentsCategory from '../../categories/components/ng-doc.category';

const ScrollerPage: NgDocPage = {
  title: `Scroller`,
  mdFile: ['./index.md', './api.md'],
  category: ComponentsCategory,
  demos: {
    Demo_Scroller_Base,
    Demo_Scroller_Sticky,
    Demo_Scroller_Virtual,
  },
  playgrounds: {
    ScrollerPlayground: {
      target: NgnScroller,
      template: `<ng-doc-selector style="height: 200px;">
        <div>Scrollable content</div>
      </ng-doc-selector>`,
    },
  },
};

export default ScrollerPage;
