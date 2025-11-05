import { Demo_Tooltip_Arrow } from '../../../demos/tooltip/arrow';
import { Demo_Tooltip_Base } from '../../../demos/tooltip/base';
import { Demo_Tooltip_Placement } from '../../../demos/tooltip/placement';
import { Demo_Tooltip_ShowOnlyIfTruncated } from '../../../demos/tooltip/show-only-if-truncated';
import { NgnDocsPage } from '../../../utils/page/types';

export const TooltipPage: NgnDocsPage = {
  title: `Tooltip`,
  kind: 'tabs',
  tabs: [
    {
      default: true,
      title: 'Features',
      mdFile: 'components/tooltip/index.md',
      components: [
        Demo_Tooltip_Base,
        Demo_Tooltip_Placement,
        Demo_Tooltip_ShowOnlyIfTruncated,
        Demo_Tooltip_Arrow,
      ],
    },
    {
      title: 'API',
      mdFile: 'components/tooltip/api.md',
    },
  ],
};
