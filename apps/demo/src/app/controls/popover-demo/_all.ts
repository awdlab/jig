import { Component } from '@angular/core';

import { All_Component, ComponentStories } from '../_base/all';

export const stories: ComponentStories = {
  id: 'popover',
  name: 'Popover',
  stories: () => [
    {
      fileName: 'base',
      title: 'Basic',
      component: import('./base-demo').then(x => x.Popover_Base_Component),
    },
    {
      fileName: 'lazy',
      title: 'Lazy',
      component: import('./lazy-demo').then(x => x.Popover_Lazy_Component),
    },
  ],
};

@Component({
  imports: [All_Component],
  selector: 'ngn-popover-all',
  template: ` <ngn-all [stories]="stories" /> `,
})
export class Popover_All_Component {
  protected readonly stories = stories;
}
