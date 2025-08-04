import { ComponentStories } from '../_base/all';

export const stories: ComponentStories = {
  id: 'checkbox',
  name: 'Checkbox',
  stories: [
    {
      fileName: 'base',
      title: 'Basic',
      component: () => import('./base-demo').then(x => x.Checkbox_Base_Component),
    },
    {
      fileName: 'indeterminate',
      title: 'Indeterminate',
      component: () => import('./indeterminate-demo').then(x => x.Checkbox_Indeterminate_Component),
    },
  ],
};
