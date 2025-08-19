import { NgDocPage } from '@ng-doc/core';
import { NgnListBox } from '@ngneers/controls/list-box';

import { Demo_ListBox_Base } from '../../../app/demos/list-box/base';
import { Demo_ListBox_Fields } from '../../../app/demos/list-box/fields-demo';
import { Demo_ListBox_Grouped } from '../../../app/demos/list-box/grouped-demo';
import { Demo_ListBox_Multiple } from '../../../app/demos/list-box/multiple';
import { Demo_ListBox_Templates } from '../../../app/demos/list-box/templates-demo';
import { Demo_ListBox_Value } from '../../../app/demos/list-box/value-demo';
import { Demo_ListBox_Virtual } from '../../../app/demos/list-box/virtual-demo';
import ComponentsCategory from '../../categories/components/ng-doc.category';

const ListBoxPage: NgDocPage = {
  title: `List Box`,
  mdFile: ['./index.md', './api.md', './playground.md'],
  category: ComponentsCategory,
  demos: {
    Demo_ListBox_Base,
    Demo_ListBox_Fields,
    Demo_ListBox_Grouped,
    Demo_ListBox_Templates,
    Demo_ListBox_Value,
    Demo_ListBox_Virtual,
    Demo_ListBox_Multiple,
  },
  playgrounds: {
    ListBoxPlayground: {
      target: NgnListBox,
      template: `<ng-doc-selector></ng-doc-selector>`,
    },
  },
};

export default ListBoxPage;
