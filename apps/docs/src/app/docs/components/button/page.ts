import { Demo_Button_Base } from '../../../demos/button/base';
import { Demo_Button_Kind } from '../../../demos/button/kind';
import { NgnDocsPage } from '../../../utils/page/types';

export const ButtonPage: NgnDocsPage = {
  title: `Button`,
  kind: 'tabs',
  tabs: [
    {
      default: true,
      title: 'Features',
      mdFile: 'components/button/index.md',
      components: [Demo_Button_Base, Demo_Button_Kind],
    },
    {
      title: 'API',
      mdFile: 'components/button/api.md',
    },
  ],
};
