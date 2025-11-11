import { Demo_Inplace_Base } from '../../../demos/inplace/base';
import { NgnDocsPage } from '../../../utils/page/types';

export const InplacePage: NgnDocsPage = {
  title: `Inplace`,
  kind: 'tabs',
  tabs: [
    {
      default: true,
      title: 'Features',
      mdFile: 'components/inplace/index.md',
      components: [Demo_Inplace_Base],
    },
    {
      title: 'API',
      mdFile: 'components/inplace/api.md',
    },
  ],
};
