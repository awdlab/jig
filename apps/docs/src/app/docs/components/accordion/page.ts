import { NgnDocsAccordionPlayground } from './playground';
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
      kind: 'single',
      default: true,
      title: 'Examples',
      mdFile: 'components/accordion/index.md',
      components: [
        Demo_Accordion_Base,
        Demo_Accordion_Multiple,
        Demo_Accordion_Lazy,
        Demo_Accordion_Disabled,
      ],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: NgnDocsAccordionPlayground,
    },
    {
      kind: 'single',
      title: 'API',
      mdFile: 'components/accordion/api.md',
    },
  ],
};
