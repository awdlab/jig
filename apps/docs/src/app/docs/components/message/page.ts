import { NgnDocsMessagePlayground } from './playground';
import { Demo_Message_Base } from '../../../demos/message/base';
import { Demo_Message_WithIcon } from '../../../demos/message/with-icon';

import type { NgnDocsPage } from '../../../utils/page/types';

export const MessagePage: NgnDocsPage = {
  title: `Message`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/message/index.md',
      components: [Demo_Message_Base, Demo_Message_WithIcon],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: NgnDocsMessagePlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/message/api.md' },
  ],
};
