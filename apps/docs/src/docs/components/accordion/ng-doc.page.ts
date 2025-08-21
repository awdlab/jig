import { NgDocPage } from '@ng-doc/core';

import { Demo_Accordion_Base } from '../../../app/demos/accordion/base';
import { Demo_Accordion_Disabled } from '../../../app/demos/accordion/disabled';
import { Demo_Accordion_Lazy } from '../../../app/demos/accordion/lazy';
import { Demo_Accordion_Multiple } from '../../../app/demos/accordion/multiple';
import ComponentsCategory from '../../categories/components/ng-doc.category';

const AccordionPage: NgDocPage = {
  title: `Accordion`,
  mdFile: ['./index.md', './api.md'],
  category: ComponentsCategory,
  demos: {
    Demo_Accordion_Base,
    Demo_Accordion_Multiple,
    Demo_Accordion_Lazy,
    Demo_Accordion_Disabled,
  },
};

export default AccordionPage;
