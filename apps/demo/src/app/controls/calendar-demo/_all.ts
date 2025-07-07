import { ComponentStories } from '../_base/all';

export const stories: ComponentStories = {
  id: 'calendar',
  name: 'Calendar',
  stories: [
    {
      fileName: 'base',
      title: 'Basic',
      component: () => import('./base-demo').then(x => x.Calendar_Base_Component),
    },
  ],
};
