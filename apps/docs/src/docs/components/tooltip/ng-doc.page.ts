import { NgDocPage } from '@ng-doc/core';

import { Demo_Tooltip_Base } from '../../../app/demos/tooltip/base';
import { Demo_Tooltip_Placement } from '../../../app/demos/tooltip/placement';
import { Demo_Tooltip_ShowOnlyIfTruncated } from '../../../app/demos/tooltip/show-only-if-truncated';
import ComponentsCategory from '../../categories/components/ng-doc.category';

const TooltipPage: NgDocPage = {
  title: `Tooltip`,
  mdFile: ['./index.md', './api.md'],
  category: ComponentsCategory,
  demos: {
    Demo_Tooltip_Base,
    Demo_Tooltip_Placement,
    Demo_Tooltip_ShowOnlyIfTruncated,
  },
};

export default TooltipPage;
