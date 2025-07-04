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
    {
      fileName: 'directive',
      title: 'Directive',
      component: import('./directive-demo').then(x => x.Button_Directive_Component),
    },
    {
      fileName: 'kind',
      title: 'Kind',
      component: import('./kind-demo').then(x => x.Button_Kind_Component),
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
