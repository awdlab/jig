import { Demo_Accordion_Base } from '../../../demos/accordion/base';
import { Demo_Accordion_Disabled } from '../../../demos/accordion/disabled';
import { Demo_Accordion_Lazy } from '../../../demos/accordion/lazy';
import { Demo_Accordion_Multiple } from '../../../demos/accordion/multiple';
import { NgnDocsPage } from '../../../utils/page/types';

export const AccordionPage: NgnDocsPage = {
  kind: 'tabs',
  title: `Accordion`,
  tabs: [
    {
      default: true,
      title: 'Features',
      mdFile: 'components/accordion/index.md',
      components: [
        Demo_Accordion_Base,
        Demo_Accordion_Multiple,
        Demo_Accordion_Lazy,
        Demo_Accordion_Disabled,
      ],
    },
    {
      title: 'API',
      mdFile: 'components/accordion/api.md',
    },
  ],
};
