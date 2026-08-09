import { NgnDocsRatingPlayground } from './playground';
import { Demo_Rating_Base } from '../../../demos/rating/base';
import { Demo_Rating_Half } from '../../../demos/rating/half';
import { Demo_Rating_CustomTemplate } from '../../../demos/rating/custom-template';
import { Demo_Rating_States } from '../../../demos/rating/states';

import type { NgnDocsPage } from '../../../utils/page/types';

export const RatingPage: NgnDocsPage = {
  title: `Rating`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,
      title: 'Examples',
      mdFile: 'components/rating/index.md',
      components: [
        Demo_Rating_Base,
        Demo_Rating_Half,
        Demo_Rating_CustomTemplate,
        Demo_Rating_States,
      ],
    },
    { kind: 'component', title: 'Playground', component: NgnDocsRatingPlayground },
    { kind: 'single', title: 'API', mdFile: 'components/rating/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/rating/a11y.md' },
  ],
};
