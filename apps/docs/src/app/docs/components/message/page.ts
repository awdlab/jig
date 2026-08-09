import { AwdDocsMessagePlayground } from './playground';
import { Demo_Message_Base } from '../../../demos/message/base';
import { Demo_Message_WithIcon } from '../../../demos/message/with-icon';
import { i18nText } from '../../../utils/i18n-doc';

import type { AwdDocsPage } from '../../../utils/page/types';

export const MessagePage: AwdDocsPage = {
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
      component: AwdDocsMessagePlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/message/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/message/a11y.md' },
    i18nText(
      "Message has no built-in translatable strings of its own. Any text it displays — the content you project into it — comes from the values you provide, so translate those in your own application's i18n layer."
    ),
  ],
};
