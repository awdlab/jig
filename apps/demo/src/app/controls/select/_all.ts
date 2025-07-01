import { Component } from '@angular/core';

import { Select_Base_Component } from './base';
import { Select_Fields_Component } from './fields';
import { Select_Filter_Component } from './filter';
import { Select_Grouped_Component } from './grouped';
import { All_Component, ComponentStory } from '../_base/all';

@Component({
  imports: [All_Component],
  template: ` <ngn-all [components]="components" /> `,
})
export class Select_All_Component {
  constructor() {}

  public readonly components: ComponentStory[] = [
    {
      title: 'Basic',
      component: Select_Base_Component,
    },
    {
      title: 'Fields',
      component: Select_Fields_Component,
    },
    {
      title: 'Filter',
      component: Select_Filter_Component,
    },
    {
      title: 'Grouped',
      component: Select_Grouped_Component,
    },
  ];
}
