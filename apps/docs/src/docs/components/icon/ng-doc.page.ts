import { NgDocPage } from '@ng-doc/core';
import { NgnIcon } from '@ngneers/controls/icon';

import { Demo_Icon_Base } from '../../../app/demos/icon/base';
import ComponentsCategory from '../../categories/components/ng-doc.category';

const IconPage: NgDocPage = {
  title: `Icon`,
  mdFile: ['./index.md', './api.md', './playground.md'],
  category: ComponentsCategory,
  demos: {
    Demo_Icon_Base,
  },
  playgrounds: {
    IconPlayground: {
      target: NgnIcon,
      template: `<ng-doc-selector></ng-doc-selector>`,
    },
  },
};

export default IconPage;
