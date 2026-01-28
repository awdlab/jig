import { NgnDocsEditInplacePlayground } from './playground';
import { Demo_EditInplace_Base } from '../../../demos/edit-inplace/base';
import { Demo_EditInplace_States } from '../../../demos/edit-inplace/states';
import { NgnDocsPage } from '../../../utils/page/types';

export const EditInplacePage: NgnDocsPage = {
  title: `Edit Inplace`,
  kind: 'tabs',
  tabs: [
    {
      default: true,
      title: 'Features',
      mdFile: 'components/edit-inplace/index.md',
      components: [Demo_EditInplace_Base, Demo_EditInplace_States],
    },
    {
      title: 'Playground',
      mdFile: 'components/edit-inplace/playground.md',
      components: [NgnDocsEditInplacePlayground],
    },
    {
      title: 'API',
      mdFile: 'components/edit-inplace/api.md',
    },
  ],
};
