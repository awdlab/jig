import { NgDocPage } from '@ng-doc/core';

import { Demo_Menu_Base } from '../../../app/demos/menu/base';
import ComponentsCategory from '../../categories/components/ng-doc.category';

const MenuPage: NgDocPage = {
  title: `Menu`,
  mdFile: ['./index.md', './api.md'],
  category: ComponentsCategory,
  demos: {
    Demo_Menu_Base,
  },
};

export default MenuPage;
