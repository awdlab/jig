import { NgnDocsHintPlayground } from './playground';
import { Demo_Hint_Base } from '../../../demos/hint/base';
import { Demo_Hint_Template } from '../../../demos/hint/template';
import { Demo_Hint_WithIcon } from '../../../demos/hint/with-icon';

import type { NgnDocsPage } from '../../../utils/page/types';

export const HintPage: NgnDocsPage = {
  title: `Hint`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/hint/index.md',
      components: [Demo_Hint_Base, Demo_Hint_WithIcon, Demo_Hint_Template],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: NgnDocsHintPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/hint/api.md' },
  ],
};
