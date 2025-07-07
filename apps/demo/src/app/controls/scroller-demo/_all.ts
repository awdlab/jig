import { ComponentStories } from '../_base/all';

export const stories: ComponentStories = {
  id: 'scroller',
  name: 'Scroller',
  stories: () => [
    {
      fileName: 'base',
      title: 'Basic',
      component: import('./base-demo').then(x => x.Scroller_Base_Component),
    },
    {
      fileName: 'sticky',
      title: 'Sticky',
      component: import('./sticky-demo').then(x => x.Scroller_Sticky_Component),
    },
    {
      fileName: 'virtual',
      title: 'Virtual',
      component: import('./virtual-demo').then(x => x.Scroller_Virtual_Component),
    },
  ],
};
