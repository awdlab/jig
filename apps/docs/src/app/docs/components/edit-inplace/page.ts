import { JigDocsEditInplacePlayground } from './playground';
import { Demo_EditInplace_Base } from '../../../demos/edit-inplace/base';
import { Demo_EditInplace_States } from '../../../demos/edit-inplace/states';
import { Demo_EditInplace_Templates } from '../../../demos/edit-inplace/templates';
import { Demo_EditInplace_Validation } from '../../../demos/edit-inplace/validation';
import { i18nKeys } from '../../../utils/i18n-doc';

import type { JigDocsPage } from '../../../utils/page/types';

export const EditInplacePage: JigDocsPage = {
  title: `Edit Inplace`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/edit-inplace/index.md',
      components: [
        Demo_EditInplace_Base,
        Demo_EditInplace_Validation,
        Demo_EditInplace_States,
        Demo_EditInplace_Templates,
      ],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: JigDocsEditInplacePlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/edit-inplace/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/edit-inplace/a11y.md' },
    i18nKeys('editInplace', {
      placeholder:
        'Fallback text shown in the display slot when no value is set, prompting the user to start editing.',
      confirm: 'Accessible label for the button that confirms and closes the inline edit.',
    }),
  ],
};
