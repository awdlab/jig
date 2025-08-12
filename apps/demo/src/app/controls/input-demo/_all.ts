import { ComponentStories } from '../_base/all';

export const stories: ComponentStories = {
  id: 'input',
  name: 'Input',
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
      fileName: 'textarea',
      title: 'Textarea',
      component: () => import('./textarea-demo').then(x => x.TextField_Textarea_Component),
    },
    {
      fileName: 'textarea-input-field',
      title: 'Textarea Input Field',
      component: () =>
        import('./textarea-input-field-demo').then(x => x.TextField_TextareaInputField_Component),
    },
  ],
};
