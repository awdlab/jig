import { Component } from '@angular/core';

import { All_Component, ComponentStories } from '../_base/all';

export const stories: ComponentStories = {
  id: 'calendar',
  name: 'Calendar',
  stories: () => [
    {
      fileName: 'base',
      title: 'Basic',
      component: import('./base-demo').then(x => x.Calendar_Base_Component),
    },
  ],
};

@Component({
  imports: [All_Component],
  selector: 'ngn-calendar-all',
  template: `<ngn-all [stories]="stories" />`,
})
export class Calendar_All_Component {
  protected readonly stories = stories;
}
