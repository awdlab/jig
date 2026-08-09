import { Demo_Badge_Base } from '../../../demos/badge/base';
import { Demo_Badge_Positions } from '../../../demos/badge/positions';
import { Demo_Badge_Dot } from '../../../demos/badge/dot';
import { Demo_Badge_Color } from '../../../demos/badge/color';

import type { JigDocsPage } from '../../../utils/page/types';

export const BadgePage: JigDocsPage = {
  title: `Badge`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,
      title: 'Examples',
      mdFile: 'components/badge/index.md',
      components: [Demo_Badge_Base, Demo_Badge_Positions, Demo_Badge_Dot, Demo_Badge_Color],
    },
    { kind: 'single', title: 'API', mdFile: 'components/badge/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/badge/a11y.md' },
  ],
};
