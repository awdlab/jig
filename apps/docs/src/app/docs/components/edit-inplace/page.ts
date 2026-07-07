import { NgnDocsEditInplacePlayground } from './playground';
import { Demo_EditInplace_Base } from '../../../demos/edit-inplace/base';
import { Demo_EditInplace_States } from '../../../demos/edit-inplace/states';
import { Demo_EditInplace_Validation } from '../../../demos/edit-inplace/validation';

import type { NgnDocsPage } from '../../../utils/page/types';

export const EditInplacePage: NgnDocsPage = {
  title: `Edit Inplace`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/edit-inplace/index.md',
      components: [Demo_EditInplace_Base, Demo_EditInplace_Validation, Demo_EditInplace_States],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: NgnDocsEditInplacePlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/edit-inplace/api.md' },
  ],
};
