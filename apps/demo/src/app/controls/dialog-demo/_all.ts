import { Component } from '@angular/core';

import { All_Component, ComponentStories } from '../_base/all';

export const stories: ComponentStories = {
  id: 'dialog',
  name: 'Dialog',
  stories: () => [
    {
      fileName: 'base',
      title: 'Basic',
      component: import('./base-demo').then(x => x.Dialog_Base_Component),
    },
    {
      fileName: 'lazy',
      title: 'Lazy',
      component: import('./lazy-demo').then(x => x.Dialog_Lazy_Component),
    },
  ],
};

@Component({
  imports: [All_Component],
  template: ` <ngn-all [stories]="stories" /> `,
})
export class Dialog_All_Component {
  protected readonly stories = stories;
}
