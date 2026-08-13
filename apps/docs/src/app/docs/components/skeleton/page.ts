import { JigDocsSkeletonPlayground } from './playground';
import { Demo_Skeleton_Base } from '../../../demos/skeleton/base';
import { Demo_Skeleton_Card } from '../../../demos/skeleton/card';
import { Demo_Skeleton_List } from '../../../demos/skeleton/list';
import { Demo_Skeleton_Loading } from '../../../demos/skeleton/loading';
import { Demo_Skeleton_Shapes } from '../../../demos/skeleton/shapes';
import { Demo_Skeleton_Text } from '../../../demos/skeleton/text';
import { i18nNone } from '../../../utils/i18n-doc';

import type { JigDocsPage } from '../../../utils/page/types';

export const SkeletonPage: JigDocsPage = {
  title: `Skeleton`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/skeleton/index.md',
      components: [
        Demo_Skeleton_Base,
        Demo_Skeleton_Shapes,
        Demo_Skeleton_Text,
        Demo_Skeleton_Card,
        Demo_Skeleton_List,
        Demo_Skeleton_Loading,
      ],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: JigDocsSkeletonPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/skeleton/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/skeleton/a11y.md' },
    i18nNone(),
  ],
};
