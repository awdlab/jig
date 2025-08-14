import { NgDocPage } from '@ng-doc/core';
import { NgnPopover } from '@ngneers/controls/popover';

import { Demo_Popover_Base } from '../../../app/demos/popover/base';
import { Demo_Popover_Lazy } from '../../../app/demos/popover/lazy';
import ComponentsCategory from '../../categories/components/ng-doc.category';

const PopoverPage: NgDocPage = {
  title: `Popover`,
  mdFile: ['./index.md', './api.md'],
  category: ComponentsCategory,
  demos: {
    Demo_Popover_Base,
    Demo_Popover_Lazy,
  },
  playgrounds: {
    PopoverPlayground: {
      target: NgnPopover,
      template: `<ngn-popover ng-doc-selector>Popover content</ngn-popover>`,
    },
  },
};

export default PopoverPage;
