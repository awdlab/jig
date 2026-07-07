import { NgnDocsStatePlayground } from './playground';
import { Demo_State_Button } from '../../../demos/state/button';
import { Demo_State_InputField } from '../../../demos/state/input-field';
import { Demo_State_Interactive } from '../../../demos/state/interactive';

import type { NgnDocsPage } from '../../../utils/page/types';

export const StatePage: NgnDocsPage = {
  title: `State`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/state/index.md',
      components: [Demo_State_Button, Demo_State_InputField, Demo_State_Interactive],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: NgnDocsStatePlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/state/api.md' },
  ],
};
