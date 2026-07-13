import { NgnDocsBreadcrumbPlayground } from './playground';
import { Demo_Breadcrumb_Base } from '../../../demos/breadcrumb/base';
import { i18nKeys } from '../../../utils/i18n-doc';

import type { NgnDocsPage } from '../../../utils/page/types';

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
    { kind: 'single', title: 'Accessibility', mdFile: 'components/breadcrumb/a11y.md' },
    i18nKeys('breadcrumb', {
      overflow:
        'Accessible label for the overflow button that opens the menu of collapsed breadcrumb items.',
    }),
  ],
};
