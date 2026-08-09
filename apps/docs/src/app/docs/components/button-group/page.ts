import { AwdDocsButtonGroupPlayground } from './playground';
import { Demo_ButtonGroup_Base } from '../../../demos/button-group/base';
import { Demo_ButtonGroup_Orientation } from '../../../demos/button-group/orientation';
import { Demo_ButtonGroup_Toggle } from '../../../demos/button-group/toggle';
import { i18nNone } from '../../../utils/i18n-doc';

import type { AwdDocsPage } from '../../../utils/page/types';

export const ButtonGroupPage: AwdDocsPage = {
  title: `Button Group`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/button-group/index.md',
      components: [Demo_ButtonGroup_Base, Demo_ButtonGroup_Orientation, Demo_ButtonGroup_Toggle],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: AwdDocsButtonGroupPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/button-group/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/button-group/a11y.md' },
    i18nNone({ projection: true }),
  ],
};
