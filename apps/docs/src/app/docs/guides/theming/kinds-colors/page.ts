import { Demo_Button_Kind } from '../../../../demos/button/kind';

import type { JigDocsPage } from '../../../../utils/page/types';

export const KindsColorsPage: JigDocsPage = {
  kind: 'single',
  title: `Kinds & Colors`,

  mdFile: 'guides/theming/kinds-colors/index.md',
  components: [Demo_Button_Kind],
};
