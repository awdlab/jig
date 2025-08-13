import { NgDocPage } from '@ng-doc/core';
import { NgnInput } from '@ngneers/controls/input';

import { Demo_TextField_Base } from '../../../app/demos/input/base';
import { Demo_TextField_InputField } from '../../../app/demos/input/input-field';
import { Demo_TextField_Textarea } from '../../../app/demos/input/textarea';
import { Demo_TextField_TextareaInputField } from '../../../app/demos/input/textarea-input-field';
import ComponentsCategory from '../../categories/components/ng-doc.category';

const InputPage: NgDocPage = {
  title: `Input`,
  mdFile: './index.md',
  category: ComponentsCategory,
  demos: {
    Demo_TextField_Base,
    Demo_TextField_InputField,
    Demo_TextField_Textarea,
    Demo_TextField_TextareaInputField,
  },
  playgrounds: {
    InputPlayground: {
      target: NgnInput,
      template: `<input ngnInput ng-doc-selector />`,
    },
  },
};

export default InputPage;
