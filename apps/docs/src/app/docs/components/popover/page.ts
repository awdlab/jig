import { JigDocsPopoverPlayground } from './playground';
import { Demo_Popover_Base } from '../../../demos/popover/base';
import { Demo_Popover_Lazy } from '../../../demos/popover/lazy';
import { i18nNone } from '../../../utils/i18n-doc';

import type { JigDocsPage } from '../../../utils/page/types';

export const PopoverPage: JigDocsPage = {
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
      component: JigDocsPopoverPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/popover/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/popover/a11y.md' },
    i18nNone({ projection: true }),
  ],
};
