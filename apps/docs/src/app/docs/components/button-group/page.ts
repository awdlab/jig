import { NgnDocsButtonGroupPlayground } from './playground';
import { Demo_ButtonGroup_Base } from '../../../demos/button-group/base';
import { NgnDocsPage } from '../../../utils/page/types';

export const ButtonGroupPage: NgnDocsPage = {
  title: `ButtonGroup`,
  kind: 'tabs',
  tabs: [
    {
      default: true,
      title: 'Features',
      mdFile: 'components/button-group/index.md',
      components: [Demo_ButtonGroup_Base],
    },

    {
      title: 'Playground',
      mdFile: 'components/button-group/playground.md',
      components: [NgnDocsButtonGroupPlayground],
    },
    {
      title: 'API',
      mdFile: 'components/button-group/api.md',
    },
  ],
};
