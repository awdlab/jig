import { NgDocPage } from '@ng-doc/core';

import { Demo_Chip_Actionable } from '../../../app/demos/chip/actionable';
import { Demo_Chip_Base } from '../../../app/demos/chip/base';
import { Demo_Chip_Closable } from '../../../app/demos/chip/closable';
import ComponentsCategory from '../../categories/components/ng-doc.category';

const ChipPage: NgDocPage = {
  title: `Chip`,
  mdFile: ['./index.md', './api.md'],
  category: ComponentsCategory,
  demos: {
    Demo_Chip_Base: Demo_Chip_Base,
    Demo_Chip_Closable: Demo_Chip_Closable,
    Demo_Chip_Actionable: Demo_Chip_Actionable,
  },
};

export default ChipPage;
