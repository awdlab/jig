import { Demo_Drag_Base } from '../../../demos/drag/base';
import { Demo_Drag_Scroll } from '../../../demos/drag/scroll';
import { i18nNone } from '../../../utils/i18n-doc';

import type { AwdDocsPage } from '../../../utils/page/types';

export const DragPage: AwdDocsPage = {
  title: `Drag`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/drag/index.md',
      components: [Demo_Drag_Base, Demo_Drag_Scroll],
    },
    { kind: 'single', title: 'API', mdFile: 'components/drag/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/drag/a11y.md' },
    i18nNone(),
  ],
};
