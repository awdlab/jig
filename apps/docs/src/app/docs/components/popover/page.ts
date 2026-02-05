import { NgnDocsPopoverPlayground } from './playground';
import { Demo_Popover_Base } from '../../../demos/popover/base';
import { Demo_Popover_Lazy } from '../../../demos/popover/lazy';

import type { NgnDocsPage } from '../../../utils/page/types';

export const PopoverPage: NgnDocsPage = {
  title: `Popover`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/popover/index.md',
      components: [Demo_Popover_Base, Demo_Popover_Lazy],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: NgnDocsPopoverPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/popover/api.md' },
  ],
};
