import { JigDocsTooltipPlayground } from './playground';
import { Demo_Tooltip_Arrow } from '../../../demos/tooltip/arrow';
import { Demo_Tooltip_Base } from '../../../demos/tooltip/base';
import { Demo_Tooltip_Placement } from '../../../demos/tooltip/placement';
import { Demo_Tooltip_ShowOnlyIfTruncated } from '../../../demos/tooltip/show-only-if-truncated';
import { i18nText } from '../../../utils/i18n-doc';

import type { JigDocsPage } from '../../../utils/page/types';

export const TooltipPage: JigDocsPage = {
  title: `Tooltip`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/tooltip/index.md',
      components: [
        Demo_Tooltip_Base,
        Demo_Tooltip_Placement,
        Demo_Tooltip_ShowOnlyIfTruncated,
        Demo_Tooltip_Arrow,
      ],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: JigDocsTooltipPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/tooltip/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/tooltip/a11y.md' },
    i18nText(
      "Tooltip has no built-in translatable strings of its own. Any text it displays — the `ngnTooltip` content (a string or template) you supply — comes from the values you provide, so translate those in your own application's i18n layer."
    ),
  ],
};
