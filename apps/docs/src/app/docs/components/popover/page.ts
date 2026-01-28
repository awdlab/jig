import { NgnDocsPopoverPlayground } from './playground';
import { Demo_Popover_Base } from '../../../demos/popover/base';
import { Demo_Popover_Lazy } from '../../../demos/popover/lazy';
import { NgnDocsPage } from '../../../utils/page/types';

export const PopoverPage: NgnDocsPage = {
  title: `Popover`,
  kind: 'tabs',
  tabs: [
    {
      default: true,
      title: 'Features',
      mdFile: 'components/popover/index.md',
      components: [Demo_Popover_Base, Demo_Popover_Lazy],
    },
    {
      title: 'Playground',
      mdFile: 'components/popover/playground.md',
      components: [NgnDocsPopoverPlayground],
    },
    {
      title: 'API',
      mdFile: 'components/popover/api.md',
    },
  ],
};
