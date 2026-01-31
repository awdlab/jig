import { NgnDocsBreadcrumbPlayground } from './playground';
import { Demo_Breadcrumb_Base } from '../../../demos/breadcrumb/base';
import { NgnDocsPage } from '../../../utils/page/types';

export const BreadcrumbPage: NgnDocsPage = {
  title: `Breadcrumb`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/breadcrumb/index.md',
      components: [Demo_Breadcrumb_Base],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: NgnDocsBreadcrumbPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/breadcrumb/api.md' },
  ],
};
