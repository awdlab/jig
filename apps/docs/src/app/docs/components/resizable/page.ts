import { Demo_Resizable_Base } from '../../../demos/resizable/base';
import { Demo_Resizable_Movable } from '../../../demos/resizable/movable';
import { i18nNone } from '../../../utils/i18n-doc';

import type { JigDocsPage } from '../../../utils/page/types';

export const ResizablePage: JigDocsPage = {
  title: `Resizable`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/resizable/index.md',
      components: [Demo_Resizable_Base, Demo_Resizable_Movable],
    },
    { kind: 'single', title: 'API', mdFile: 'components/resizable/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/resizable/a11y.md' },
    i18nNone(),
  ],
};
