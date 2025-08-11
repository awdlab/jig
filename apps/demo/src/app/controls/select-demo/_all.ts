import { ComponentStories } from '../_base/all';

export const stories: ComponentStories = {
  id: 'select',
  name: 'Select',
  stories: [
    {
      fileName: 'base',
      title: 'Basic',
      component: () => import('./base-demo').then(x => x.Select_Base_Component),
    },
    {
      fileName: 'fields',
      title: 'Fields',
      component: () => import('./fields-demo').then(x => x.Select_Fields_Component),
    },
    {
      fileName: 'filter',
      title: 'Filter',
      component: () => import('./filter-demo').then(x => x.Select_Filter_Component),
    },
    {
      fileName: 'grouped',
      title: 'Grouped',
      component: () => import('./grouped-demo').then(x => x.Select_Grouped_Component),
    },
    {
      fileName: 'editable',
      title: 'Editable',
      component: () => import('./editable-demo').then(x => x.Select_Editable_Component),
    },
    {
      fileName: 'editable-custom',
      title: 'Editable Custom',
      component: () =>
        import('./editable-custom-demo').then(x => x.Select_Editable_Custom_Component),
    },
    {
      fileName: 'templates',
      title: 'Templates',
      component: () => import('./templates-demo').then(x => x.Select_Templates_Component),
    },
  ],
};
