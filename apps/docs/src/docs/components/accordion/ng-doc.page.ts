import { NgDocPage } from '@ng-doc/core';

import { Demo_Accordion_Base } from '../../../app/demos/accordion/base';
import ComponentsCategory from '../../categories/components/ng-doc.category';

const AccordionPage: NgDocPage = {
  title: `Accordion`,
  mdFile: ['./index.md', './api.md'],
  category: ComponentsCategory,
  demos: {
    Demo_Accordion_Base,
  },
};

export default AccordionPage;
