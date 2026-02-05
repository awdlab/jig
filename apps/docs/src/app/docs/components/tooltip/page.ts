import { NgnDocsTooltipPlayground } from './playground';
import { Demo_Tooltip_Arrow } from '../../../demos/tooltip/arrow';
import { Demo_Tooltip_Base } from '../../../demos/tooltip/base';
import { Demo_Tooltip_Placement } from '../../../demos/tooltip/placement';
import { Demo_Tooltip_ShowOnlyIfTruncated } from '../../../demos/tooltip/show-only-if-truncated';

import type { NgnDocsPage } from '../../../utils/page/types';

export const TooltipPage: NgnDocsPage = {
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
      component: NgnDocsTooltipPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/tooltip/api.md' },
  ],
};
