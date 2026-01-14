import { Demo_Progress_Base } from '../../../demos/progress/base';
import { Demo_Progress_Circular } from '../../../demos/progress/circular';
import { Demo_Progress_CircularIndeterminate } from '../../../demos/progress/circular-indeterminate';
import { Demo_Progress_Indeterminate } from '../../../demos/progress/indeterminate';
import { Demo_Progress_Sizes } from '../../../demos/progress/sizes';
import { NgnDocsPage } from '../../../utils/page/types';

export const ProgressPage: NgnDocsPage = {
  title: `Progress`,
  kind: 'tabs',
  tabs: [
    {
      default: true,
      title: 'Features',
      mdFile: 'components/progress/index.md',
      components: [
        Demo_Progress_Base,
        Demo_Progress_Indeterminate,
        Demo_Progress_Circular,
        Demo_Progress_CircularIndeterminate,
        Demo_Progress_Sizes,
      ],
    },
    {
      title: 'API',
      mdFile: 'components/progress/api.md',
    },
  ],
};
