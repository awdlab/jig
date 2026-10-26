import { Demo_Label_Base } from '../../../demos/label/base';
import { Demo_Label_Group } from '../../../demos/label/group';
import { i18nNone } from '../../../utils/i18n-doc';

import type { JigDocsPage } from '../../../utils/page/types';

export const LabelPage: JigDocsPage = {
  title: `Label`,
  source: 'directives/for.ts',
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/label/index.md',
      components: [Demo_Label_Base, Demo_Label_Group],
    },
    { kind: 'single', title: 'API', mdFile: 'components/label/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/label/a11y.md' },
    i18nNone(),
  ],
};
