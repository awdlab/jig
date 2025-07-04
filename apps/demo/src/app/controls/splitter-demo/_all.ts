import { Component } from '@angular/core';

import { All_Component, ComponentStories } from '../_base/all';

export const stories: ComponentStories = {
  id: 'splitter',
  name: 'Splitter',
  stories: () => [
    {
      fileName: 'base',
      title: 'Basic',
      component: import('./base-demo').then(x => x.Splitter_Base_Component),
    },
  ],
};

@Component({
  imports: [All_Component],
  selector: 'ngn-splitter-all',
  template: ` <ngn-all [stories]="stories" /> `,
})
export class Splitter_All_Component {
  protected readonly stories = stories;
}
