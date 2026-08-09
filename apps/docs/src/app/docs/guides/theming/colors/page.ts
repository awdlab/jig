import { JigThemeColorsDemo } from '../../../../page-components/colors';

import type { JigDocsPage } from '../../../../utils/page/types';

export const ColorsPage: JigDocsPage = {
  kind: 'single',
  title: `Colors`,

  mdFile: 'guides/theming/colors/index.md',
  components: [JigThemeColorsDemo],
};
