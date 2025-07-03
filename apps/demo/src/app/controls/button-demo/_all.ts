import { Component } from '@angular/core';

import { All_Component, ComponentStories } from '../_base/all';

export const stories: ComponentStories = {
  id: 'button',
  name: 'Button',
  stories: () => [
    {
      fileName: 'base',
      title: 'Basic',
      component: import('./base-demo').then(x => x.Button_Base_Component),
    },
  ],
};

@Component({
  imports: [All_Component],
  selector: 'ngn-button-all',
  template: ` <ngn-all [stories]="stories" /> `,
})
export class Button_All_Component {
  protected readonly stories = stories;
}
