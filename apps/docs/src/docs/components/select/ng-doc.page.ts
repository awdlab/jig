import { NgDocPage } from '@ng-doc/core';
import { NgnSelect } from '@ngneers/controls/select';

import { Demo_Select_Base } from '../../../app/demos/select/base';
import { Demo_Select_Editable } from '../../../app/demos/select/editable';
import { Demo_Select_EditableCustom } from '../../../app/demos/select/editable-custom';
import { Demo_Select_Fields } from '../../../app/demos/select/fields';
import { Demo_Select_Filter } from '../../../app/demos/select/filter';
import { Demo_Select_Grouped } from '../../../app/demos/select/grouped';
import { Demo_Select_Templates } from '../../../app/demos/select/templates';
import ComponentsCategory from '../../categories/components/ng-doc.category';

const SelectPage: NgDocPage = {
  title: `Select`,
  mdFile: './index.md',
  category: ComponentsCategory,
  demos: {
    Demo_Select_Base,
    Demo_Select_Fields,
    Demo_Select_Filter,
    Demo_Select_Grouped,
    Demo_Select_Templates,
    Demo_Select_Editable,
    Demo_Select_EditableCustom,
  },
  playgrounds: {
    SelectPlayground: {
      target: NgnSelect,
      template: `<ngn-select ng-doc-selector></ngn-select>`,
    },
  },
};

export default SelectPage;
