import { NgnDocsIconPlayground } from './playground';
import { Demo_Icon_Base } from '../../../demos/icon/base';
import { NgnDocsPage } from '../../../utils/page/types';

export const IconPage: NgnDocsPage = {
  title: `Icon`,
  kind: 'tabs',
  tabs: [
    {
      default: true,
      title: 'Features',
      mdFile: 'components/icon/index.md',
      components: [Demo_Icon_Base],
    },
    {
      title: 'Playground',
      mdFile: 'components/icon/playground.md',
      components: [NgnDocsIconPlayground],
    },
    {
      title: 'API',
      mdFile: 'components/icon/api.md',
    },
  ],
};
