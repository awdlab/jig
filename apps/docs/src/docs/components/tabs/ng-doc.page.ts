import { NgDocPage } from '@ng-doc/core';

import { Demo_Tabs_Base } from '../../../app/demos/tabs/base';
import ComponentsCategory from '../../categories/components/ng-doc.category';

const TabsPage: NgDocPage = {
  title: `Tabs`,
  mdFile: ['./index.md', './api.md'],
  category: ComponentsCategory,
  demos: {
    Demo_Tabs_Base,
  },
};

export default TabsPage;
