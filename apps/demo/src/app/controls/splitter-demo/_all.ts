import { ComponentStories } from '../_base/all';

export const stories: ComponentStories = {
  id: 'splitter',
  name: 'Splitter',
  stories: [
    {
      fileName: 'base',
      title: 'Basic',
      component: () => import('./base-demo').then(x => x.Splitter_Base_Component),
    },
    {
      fileName: 'vertical',
      title: 'Vertical Layout',
      component: () => import('./vertical-demo').then(x => x.Splitter_Vertical_Component),
    },
    {
      fileName: 'min-max',
      title: 'Min/Max Sizes',
      component: () => import('./min-max-demo').then(x => x.Splitter_MinMax_Component),
    },
    {
      fileName: 'reorder',
      title: 'Reorder Panels',
      component: () => import('./reorder-demo').then(x => x.Splitter_Reorder_Component),
    },
    {
      fileName: 'state',
      title: 'State Management',
      component: () => import('./state-demo').then(x => x.Splitter_State_Component),
    },
  ],
};
