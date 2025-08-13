import { NgDocPage } from '@ng-doc/core';
import { NgnInputMask } from '@ngneers/controls/input-mask';

import { Demo_TextField_Mask } from '../../../app/demos/input-mask/base';
import ComponentsCategory from '../../categories/components/ng-doc.category';

const InputMaskPage: NgDocPage = {
  title: `Input Mask`,
  mdFile: './index.md',
  category: ComponentsCategory,
  demos: {
    Demo_TextField_Mask,
  },
  playgrounds: {
    InputMaskPlayground: {
      target: NgnInputMask,
      template: `<ngn-input-mask ng-doc-selector></ngn-input-mask>`,
    },
  },
};

export default InputMaskPage;
