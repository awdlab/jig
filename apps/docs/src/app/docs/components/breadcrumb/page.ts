import { NgnDocsBreadcrumbPlayground } from './playground';
import { Demo_Breadcrumb_Base } from '../../../demos/breadcrumb/base';
import { NgnDocsPage } from '../../../utils/page/types';

export const BreadcrumbPage: NgnDocsPage = {
  title: `Breadcrumb`,
  kind: 'tabs',
  tabs: [
    {
      default: true,
      title: 'Features',
      mdFile: 'components/breadcrumb/index.md',
      components: [Demo_Breadcrumb_Base],
    },
    {
      title: 'Playground',
      mdFile: 'components/breadcrumb/playground.md',
      components: [NgnDocsBreadcrumbPlayground],
    },
    {
      title: 'API',
      mdFile: 'components/breadcrumb/api.md',
    },
  ],
};
