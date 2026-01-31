import { NgnDocsIconPlayground } from './playground';
import { Demo_Icon_Base } from '../../../demos/icon/base';
import { NgnDocsPage } from '../../../utils/page/types';

export const IconPage: NgnDocsPage = {
  title: `Icon`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/icon/index.md',
      components: [Demo_Icon_Base],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: NgnDocsIconPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/icon/api.md' },
  ],
};
