import { NgDocPage } from '@ng-doc/core';

import { Demo_ItemView_Base } from '../../../app/demos/item-view/base';
import ComponentsCategory from '../../categories/components/ng-doc.category';

const ItemViewPage: NgDocPage = {
  title: `ItemView`,
  mdFile: ['./index.md', './api.md'],
  category: ComponentsCategory,
  demos: {
    Demo_ItemView_Base,
  },
};

export default ItemViewPage;
