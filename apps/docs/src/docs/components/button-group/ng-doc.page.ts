import { NgDocPage } from '@ng-doc/core';

import { Demo_Button_Group_Base } from '../../../app/demos/button-group/base';
import ComponentsCategory from '../../categories/components/ng-doc.category';

const ButtonGroupPage: NgDocPage = {
  title: `ButtonGroup`,
  mdFile: ['./index.md', './api.md'],
  category: ComponentsCategory,
  demos: {
    Demo_Button_Group_Base,
  },
};

export default ButtonGroupPage;
