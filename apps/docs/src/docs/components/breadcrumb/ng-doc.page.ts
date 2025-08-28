import { NgDocPage } from '@ng-doc/core';

import { Demo_Breadcrumb_Base } from '../../../app/demos/breadcrumb/base';
import ComponentsCategory from '../../categories/components/ng-doc.category';

const BreadcrumbPage: NgDocPage = {
  title: `Breadcrumb`,
  mdFile: ['./index.md', './api.md'],
  category: ComponentsCategory,
  demos: {
    Demo_Breadcrumb_Base,
  },
};

export default BreadcrumbPage;
