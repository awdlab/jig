import { Demo_RovingFocus_Activedescendant } from '../../../demos/roving-focus/activedescendant';
import { Demo_RovingFocus_Base } from '../../../demos/roving-focus/base';
import { i18nNone } from '../../../utils/i18n-doc';

import type { AwdDocsPage } from '../../../utils/page/types';

export const RovingFocusPage: AwdDocsPage = {
  title: `Roving Focus`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/roving-focus/index.md',
      components: [Demo_RovingFocus_Base, Demo_RovingFocus_Activedescendant],
    },
    { kind: 'single', title: 'API', mdFile: 'components/roving-focus/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/roving-focus/a11y.md' },
    i18nNone(),
  ],
};
