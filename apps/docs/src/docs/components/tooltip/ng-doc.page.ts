import { NgDocPage } from '@ng-doc/core';

import { Demo_Tooltip_Base } from '../../../app/demos/tooltip/base';
import ComponentsCategory from '../../categories/components/ng-doc.category';

const TooltipPage: NgDocPage = {
  title: `Tooltip`,
  mdFile: ['./index.md', './api.md'],
  category: ComponentsCategory,
  demos: {
    Demo_Tooltip_Base,
  },
};

export default TooltipPage;
