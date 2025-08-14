import { NgDocPage } from '@ng-doc/core';
import { NgnCheckbox } from '@ngneers/controls/checkbox';

import { Demo_Checkbox_Base } from '../../../app/demos/checkbox/base';
import { Demo_Checkbox_Indeterminate } from '../../../app/demos/checkbox/indeterminate';
import ComponentsCategory from '../../categories/components/ng-doc.category';

const CheckboxPage: NgDocPage = {
  title: `Checkbox`,
  mdFile: ['./index.md', './api.md'],
  category: ComponentsCategory,
  demos: {
    Demo_Checkbox_Base,
    Demo_Checkbox_Indeterminate,
  },
  playgrounds: {
    CheckboxPlayground: {
      target: NgnCheckbox,
      template: `<ngn-checkbox ng-doc-selector>Check me</ngn-checkbox>`,
    },
  },
};

export default CheckboxPage;
