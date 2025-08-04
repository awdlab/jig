import { ComponentStories } from '../_base/all';

export const stories: ComponentStories = {
  id: 'input-mask',
  name: 'Input Mask',
  stories: [
    {
      fileName: 'base',
      title: 'Basic',
      component: () => import('./base-demo').then(x => x.TextField_Mask_Component),
    },
  ],
};
