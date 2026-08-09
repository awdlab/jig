import { JigDocsAccordionPlayground } from './playground';
import { Demo_Accordion_Base } from '../../../demos/accordion/base';
import { Demo_Accordion_Disabled } from '../../../demos/accordion/disabled';
import { Demo_Accordion_Lazy } from '../../../demos/accordion/lazy';
import { Demo_Accordion_Multiple } from '../../../demos/accordion/multiple';
import { i18nText } from '../../../utils/i18n-doc';

import type { JigDocsPage } from '../../../utils/page/types';

export const AccordionPage: JigDocsPage = {
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
      component: JigDocsAccordionPlayground,
    },
    {
      kind: 'single',
      title: 'API',
      mdFile: 'components/accordion/api.md',
    },
    { kind: 'single', title: 'A11y', mdFile: 'components/accordion/a11y.md' },
    i18nText(
      "Accordion has no built-in translatable strings of its own. Any text it displays — the `header` text on each `jig-accordion-panel` and the panel body you project into it — comes from the values you provide, so translate those in your own application's i18n layer."
    ),
  ],
};
