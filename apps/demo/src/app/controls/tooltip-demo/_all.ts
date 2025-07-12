import { ComponentStories } from '../_base/all';

export const stories: ComponentStories = {
  id: 'tooltip',
  name: 'Tooltip',
  stories: [
    {
      fileName: 'base',
      title: 'Basic',
      component: () => import('./base-demo').then(x => x.Tooltip_Base_Component),
    },
  ],
};
