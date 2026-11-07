import { Demo_RovingGroup_Activedescendant } from '../../../demos/roving-group/activedescendant';
import { Demo_RovingGroup_Base } from '../../../demos/roving-group/base';
import { i18nNone } from '../../../utils/i18n-doc';

import type { JigDocsPage } from '../../../utils/page/types';

export const RovingGroupPage: JigDocsPage = {
  title: `Roving Group`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/roving-group/index.md',
      components: [Demo_RovingGroup_Base, Demo_RovingGroup_Activedescendant],
    },
    { kind: 'single', title: 'API', mdFile: 'components/roving-group/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/roving-group/a11y.md' },
    i18nNone(),
  ],
};
