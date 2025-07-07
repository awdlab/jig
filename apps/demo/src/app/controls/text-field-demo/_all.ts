import { ComponentStories } from '../_base/all';

export const stories: ComponentStories = {
  id: 'text-field',
  name: 'Text Field',
  stories: () => [
    {
      fileName: 'base',
      title: 'Basic',
      component: import('./base-demo').then(x => x.TextField_Base_Component),
    },
  ],
};
