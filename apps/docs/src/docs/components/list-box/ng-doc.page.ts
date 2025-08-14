import { NgDocPage } from '@ng-doc/core';
import { NgnListBox } from '@ngneers/controls/list-box';

import { Demo_ListBox_Base } from '../../../app/demos/list-box/base';
import { ListBox_Fields_Component } from '../../../app/demos/list-box/fields-demo';
import { ListBox_Grouped_Component } from '../../../app/demos/list-box/grouped-demo';
import { ListBox_Templates_Component } from '../../../app/demos/list-box/templates-demo';
import { ListBox_Value_Component } from '../../../app/demos/list-box/value-demo';
import { ListBox_Virtual_Component } from '../../../app/demos/list-box/virtual-demo';
import ComponentsCategory from '../../categories/components/ng-doc.category';

const ListBoxPage: NgDocPage = {
  title: `List Box`,
  mdFile: ['./index.md', './api.md', './playground.md'],
  category: ComponentsCategory,
  demos: {
    Demo_ListBox_Base,
    ListBox_Fields_Component,
    ListBox_Grouped_Component,
    ListBox_Templates_Component,
    ListBox_Value_Component,
    ListBox_Virtual_Component,
  },
  playgrounds: {
    ListBoxPlayground: {
      target: NgnListBox,
      template: `<ngn-list-box ng-doc-selector></ngn-list-box>`,
    },
  },
};

export default ListBoxPage;
