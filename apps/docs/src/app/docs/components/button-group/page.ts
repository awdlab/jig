import { NgnDocsButtonGroupPlayground } from './playground';
import { Demo_ButtonGroup_Base } from '../../../demos/button-group/base';
import { NgnDocsPage } from '../../../utils/page/types';

export const ButtonGroupPage: NgnDocsPage = {
  title: `ButtonGroup`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/button-group/index.md',
      components: [Demo_ButtonGroup_Base],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: NgnDocsButtonGroupPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/button-group/api.md' },
  ],
};
