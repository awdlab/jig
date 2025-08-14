import { NgDocPage } from '@ng-doc/core';
import { NgnInput } from '@ngneers/controls/input';
import { NgnInputMask } from '@ngneers/controls/input-mask';

import { Demo_TextField_Mask } from '../../../app/demos/input-mask/base';
import ComponentsCategory from '../../categories/components/ng-doc.category';

const InputMaskPage: NgDocPage = {
  title: `Input Mask`,
  mdFile: ['./index.md', './api.md'],
  category: ComponentsCategory,
  demos: {
    Demo_TextField_Mask,
  },
  imports: [NgnInput],
  playgrounds: {
    InputMaskPlayground: {
      target: NgnInputMask,
      template: `<ng-doc-selector>
        <input ngnInput>
      </ng-doc-selector>`,
    },
  },
};

export default InputMaskPage;
