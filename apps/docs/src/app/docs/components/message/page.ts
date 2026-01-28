import { NgnDocsMessagePlayground } from './playground';
import { Demo_Message_Base } from '../../../demos/message/base';
import { Demo_Message_WithIcon } from '../../../demos/message/with-icon';
import { NgnDocsPage } from '../../../utils/page/types';

export const MessagePage: NgnDocsPage = {
  title: `Message`,
  kind: 'tabs',
  tabs: [
    {
      default: true,
      title: 'Features',
      mdFile: 'components/message/index.md',
      components: [Demo_Message_Base, Demo_Message_WithIcon],
    },
    {
      title: 'Playground',
      mdFile: 'components/message/playground.md',
      components: [NgnDocsMessagePlayground],
    },
    {
      title: 'API',
      mdFile: 'components/message/api.md',
    },
  ],
};
