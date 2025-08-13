import { NgDocPage } from '@ng-doc/core';

import { Demo_Button_Base } from '../../../app/demos/button/base';
import { Demo_Button_Kind } from '../../../app/demos/button/kind';
import ComponentsCategory from '../../categories/components/ng-doc.category';

const ButtonPage: NgDocPage = {
  title: `Button`,
  mdFile: './index.md',
  category: ComponentsCategory,
  demos: {
    Demo_Button_Base,
    Demo_Button_Kind,
  },
};

export default ButtonPage;
