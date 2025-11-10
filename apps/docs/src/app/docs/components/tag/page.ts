import { Demo_Tag_Base } from '../../../demos/tag/base';
import { Demo_Tag_WithIcon } from '../../../demos/tag/with-icon';
import { NgnDocsPage } from '../../../utils/page/types';

export const TagPage: NgnDocsPage = {
  title: `Tag`,
  kind: 'tabs',
  tabs: [
    {
      default: true,
      title: 'Features',
      mdFile: 'components/tag/index.md',
      components: [Demo_Tag_Base, Demo_Tag_WithIcon],
    },
    {
      title: 'API',
      mdFile: 'components/tag/api.md',
    },
  ],
};
