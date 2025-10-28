import { NgDocPage } from '@ng-doc/core';
import { NgnDialog } from '@ngneers/controls/dialog';

import { Demo_Dialog_Base } from '../../../app/demos/dialog/base';
import { Demo_Dialog_Buttons } from '../../../app/demos/dialog/buttons';
import { Demo_Dialog_Lazy } from '../../../app/demos/dialog/lazy';
import { Demo_Dialog_Movable } from '../../../app/demos/dialog/movable';
import ComponentsCategory from '../../categories/components/ng-doc.category';

const DialogPage: NgDocPage = {
  title: `Dialog`,
  mdFile: ['./index.md', './api.md'],
  category: ComponentsCategory,
  demos: {
    Demo_Dialog_Base,
    Demo_Dialog_Lazy,
    Demo_Dialog_Buttons,
    Demo_Dialog_Movable,
  },
  playgrounds: {
    DialogPlayground: {
      target: NgnDialog,
      template: `<ngn-dialog ng-doc-selector>Dialog content</ngn-dialog>`,
    },
  },
};

export default DialogPage;
