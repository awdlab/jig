import { Component } from '@angular/core';

import { All_Component, ComponentStories } from '../_base/all';

export const stories: ComponentStories = {
  id: 'text-field',
  name: 'Text Field',
  stories: () => [
    {
      fileName: 'base',
      title: 'Basic',
      component: import('./base-demo').then(x => x.TextField_Base_Component),
    },
  ],
};

@Component({
  imports: [All_Component],
  template: `<ngn-all [stories]="stories" />`,
})
export class TextField_All_Component {
  protected readonly stories = stories;
}
