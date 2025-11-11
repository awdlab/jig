import { Demo_EditInplace_Base } from '../../../demos/edit-inplace/base';
import { NgnDocsPage } from '../../../utils/page/types';

export const EditInplacePage: NgnDocsPage = {
  title: `Edit Inplace`,
  kind: 'tabs',
  tabs: [
    {
      default: true,
      title: 'Features',
      mdFile: 'components/edit-inplace/index.md',
      components: [Demo_EditInplace_Base],
    },
    {
      title: 'API',
      mdFile: 'components/edit-inplace/api.md',
    },
  ],
};
