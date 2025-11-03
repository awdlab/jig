import { Demo_Icon_Base } from '../../../demos/icon/base';
import { NgnDocsPage } from '../../../utils/page/types';

export const IconPage: NgnDocsPage = {
  title: `Icon`,
  kind: 'tabs',
  tabs: [
    {
      default: true,
      title: 'Examples',
      mdFile: 'components/icon/index.md',
      components: [Demo_Icon_Base],
    },
    {
      title: 'API',
      mdFile: 'components/icon/api.md',
    },
  ],
};
