import { Component } from '@angular/core';

import { Popover_Base_Component } from './base';
import { Popover_Lazy_Component } from './lazy';
import { All_Component, ComponentStory } from '../_base/all';

@Component({
  imports: [All_Component],
  template: ` <ngn-all [components]="components" /> `,
})
export class Popover_All_Component {
  constructor() {}

  public readonly components: ComponentStory[] = [
    {
      title: 'Basic',
      component: Popover_Base_Component,
    },
    {
      title: 'Lazy',
      component: Popover_Lazy_Component,
    },
  ];
}
