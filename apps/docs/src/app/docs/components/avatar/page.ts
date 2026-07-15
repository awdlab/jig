import { NgnDocsAvatarPlayground } from './playground';
import { Demo_Avatar_Base } from '../../../demos/avatar/base';
import { Demo_Avatar_Group } from '../../../demos/avatar/group';
import { Demo_Avatar_Icon } from '../../../demos/avatar/icon';
import { Demo_Avatar_Image } from '../../../demos/avatar/image';
import { Demo_Avatar_Size } from '../../../demos/avatar/size';
import { i18nText } from '../../../utils/i18n-doc';

import type { NgnDocsPage } from '../../../utils/page/types';

export const AvatarPage: NgnDocsPage = {
  title: `Avatar`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/avatar/index.md',
      components: [
        Demo_Avatar_Base,
        Demo_Avatar_Image,
        Demo_Avatar_Size,
        Demo_Avatar_Icon,
        Demo_Avatar_Group,
      ],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: NgnDocsAvatarPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/avatar/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/avatar/a11y.md' },
    i18nText(
      "Avatar has no built-in translatable strings of its own. Any text it displays — the `initials` and the image `alt` text — comes from the values you provide, so translate those in your own application's i18n layer."
    ),
  ],
};
