import { ComponentStories } from '../_base/all';

export const stories: ComponentStories = {
  id: 'text-field',
  name: 'Text Field',
  stories: [
    {
      fileName: 'base',
      title: 'Basic',
      component: () => import('./base-demo').then(x => x.TextField_Base_Component),
    },
    {
      fileName: 'input-field',
      title: 'Input Field',
      component: () => import('./input-field-demo').then(x => x.TextField_InputField_Component),
    },
    {
      fileName: 'mask',
      title: 'Mask',
      component: () => import('./mask-demo').then(x => x.TextField_Mask_Component),
    },
  ],
};
