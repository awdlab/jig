import { NgnDocsDialogPlayground } from './playground';
import { Demo_Dialog_Base } from '../../../demos/dialog/base';
import { Demo_Dialog_Buttons } from '../../../demos/dialog/buttons';
import { Demo_Dialog_CreateDialog } from '../../../demos/dialog/create-dialog';
import { Demo_Dialog_Lazy } from '../../../demos/dialog/lazy';
import { Demo_Dialog_Movable } from '../../../demos/dialog/movable';
import { Demo_Dialog_Prompt } from '../../../demos/dialog/prompt';
import { NgnDocsPage } from '../../../utils/page/types';

export const DialogPage: NgnDocsPage = {
  title: `Dialog`,
  kind: 'tabs',
  tabs: [
    {
      default: true,
      title: 'Features',
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
      title: 'Playground',
      mdFile: 'components/dialog/playground.md',
      components: [NgnDocsDialogPlayground],
    },
    {
      title: 'API',
      mdFile: 'components/dialog/api.md',
    },
  ],
};
