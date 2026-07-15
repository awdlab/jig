import { NgnDocsDialogPlayground } from './playground';
import { Demo_Dialog_Base } from '../../../demos/dialog/base';
import { Demo_Dialog_Buttons } from '../../../demos/dialog/buttons';
import { Demo_Dialog_CreateDialog } from '../../../demos/dialog/create-dialog';
import { Demo_Dialog_Lazy } from '../../../demos/dialog/lazy';
import { Demo_Dialog_Movable } from '../../../demos/dialog/movable';
import { Demo_Dialog_Prompt } from '../../../demos/dialog/prompt';
import { i18nKeys } from '../../../utils/i18n-doc';

import type { NgnDocsPage } from '../../../utils/page/types';

export const DialogPage: NgnDocsPage = {
  title: `Dialog`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/dialog/index.md',
      components: [
        Demo_Dialog_Base,
        Demo_Dialog_Lazy,
        Demo_Dialog_Buttons,
        Demo_Dialog_Movable,
        Demo_Dialog_Prompt,
        Demo_Dialog_CreateDialog,
      ],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: NgnDocsDialogPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/dialog/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/dialog/a11y.md' },
    i18nKeys('dialog', {
      close: 'Accessible label for the close button in the dialog header.',
    }),
  ],
};
