import { Demo_Pt_Attributes } from '../../../../demos/pt/attributes';
import { Demo_Pt_Classes } from '../../../../demos/pt/classes';
import { Demo_Pt_Deps } from '../../../../demos/pt/deps';
import { Demo_Pt_Listeners } from '../../../../demos/pt/listeners';
import { Demo_Pt_Styles } from '../../../../demos/pt/styles';

import type { NgnDocsPage } from '../../../../utils/page/types';

export const PassthroughPage: NgnDocsPage = {
  kind: 'single',
  title: `Passthrough`,

  mdFile: 'guides/concepts/passthrough/index.md',
  components: [
    Demo_Pt_Styles,
    Demo_Pt_Attributes,
    Demo_Pt_Classes,
    Demo_Pt_Listeners,
    Demo_Pt_Deps,
  ],
};
