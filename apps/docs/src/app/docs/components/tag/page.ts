import { AwdDocsTagPlayground } from './playground';
import { Demo_Tag_Base } from '../../../demos/tag/base';
import { Demo_Tag_WithIcon } from '../../../demos/tag/with-icon';
import { i18nText } from '../../../utils/i18n-doc';

import type { AwdDocsPage } from '../../../utils/page/types';

export const TagPage: AwdDocsPage = {
  title: `Tag`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/tag/index.md',
      components: [Demo_Tag_Base, Demo_Tag_WithIcon],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: AwdDocsTagPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/tag/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/tag/a11y.md' },
    i18nText(
      "Tag has no built-in translatable strings of its own. Any text it displays — the content you project into it — comes from the values you provide, so translate those in your own application's i18n layer."
    ),
  ],
};
