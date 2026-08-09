import { AwdDocsBreadcrumbPlayground } from './playground';
import { Demo_Breadcrumb_Base } from '../../../demos/breadcrumb/base';
import { i18nKeys } from '../../../utils/i18n-doc';

import type { AwdDocsPage } from '../../../utils/page/types';

export const BreadcrumbPage: AwdDocsPage = {
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
      component: AwdDocsBreadcrumbPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/breadcrumb/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/breadcrumb/a11y.md' },
    i18nKeys('breadcrumb', {
      overflow:
        'Accessible label for the overflow button that opens the menu of collapsed breadcrumb items.',
    }),
  ],
};
