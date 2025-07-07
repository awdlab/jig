import { ComponentStories } from '../_base/all';

export const stories: ComponentStories = {
  id: 'button',
  name: 'Button',
  stories: () => [
    {
      fileName: 'base',
      title: 'Basic',
      component: import('./base-demo').then(x => x.Button_Base_Component),
    },
    {
      fileName: 'directive',
      title: 'Directive',
      component: import('./directive-demo').then(x => x.Button_Directive_Component),
    },
    {
      fileName: 'kind',
      title: 'Kind',
      component: import('./kind-demo').then(x => x.Button_Kind_Component),
    },
  ],
};
