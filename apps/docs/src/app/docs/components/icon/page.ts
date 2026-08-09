import { AwdDocsIconPlayground } from './playground';
import { Demo_Icon_Base } from '../../../demos/icon/base';
import { Demo_Icon_DefaultIcon } from '../../../demos/icon/default-icon';
import { Demo_Icon_Sizing } from '../../../demos/icon/sizing';
import { i18nNone } from '../../../utils/i18n-doc';

import type { AwdDocsPage } from '../../../utils/page/types';

export const IconPage: AwdDocsPage = {
  title: `Icon`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/icon/index.md',
      components: [Demo_Icon_Base, Demo_Icon_DefaultIcon, Demo_Icon_Sizing],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: AwdDocsIconPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/icon/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/icon/a11y.md' },
    i18nNone(),
  ],
};
