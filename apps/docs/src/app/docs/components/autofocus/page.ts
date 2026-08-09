import { Demo_Autofocus_Base } from '../../../demos/autofocus/base';
import { Demo_Autofocus_Conditional } from '../../../demos/autofocus/conditional';
import { i18nNone } from '../../../utils/i18n-doc';

import type { NgnDocsPage } from '../../../utils/page/types';

export const AutofocusPage: NgnDocsPage = {
  title: `Autofocus`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/autofocus/index.md',
      components: [Demo_Autofocus_Base, Demo_Autofocus_Conditional],
    },
    { kind: 'single', title: 'API', mdFile: 'components/autofocus/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/autofocus/a11y.md' },
    i18nNone(),
  ],
};
