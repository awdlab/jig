import { ComponentStories } from '../_base/all';

export const stories: ComponentStories = {
  id: 'input-mask',
  name: 'Input Mask',
  stories: [
    {
      fileName: 'mask',
      title: 'Mask',
      component: () => import('./mask-demo').then(x => x.TextField_Mask_Component),
    },
  ],
};
