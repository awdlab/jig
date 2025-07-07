import { ComponentStories } from '../_base/all';

export const stories: ComponentStories = {
  id: 'list-box',
  name: 'List Box',
  stories: () => [
    {
      fileName: 'base',
      title: 'Basic',
      component: import('./base-demo').then(x => x.ListBox_Base_Component),
    },
    {
      fileName: 'fields',
      title: 'Fields',
      component: import('./fields-demo').then(x => x.ListBox_Fields_Component),
    },
    {
      fileName: 'grouped',
      title: 'Grouped',
      component: import('./grouped-demo').then(x => x.ListBox_Grouped_Component),
    },
    {
      fileName: 'value',
      title: 'Value',
      component: import('./value-demo').then(x => x.ListBox_Value_Component),
    },
    {
      fileName: 'virtual',
      title: 'Virtual',
      component: import('./virtual-demo').then(x => x.ListBox_Virtual_Component),
    },
    {
      fileName: 'templates',
      title: 'Templates',
      component: import('./templates-demo').then(x => x.ListBox_Templates_Component),
    },
  ],
};
