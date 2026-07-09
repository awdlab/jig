import { NgnThemeColorsDemo } from '../../../../page-components/colors';

import type { NgnDocsPage } from '../../../../utils/page/types';

export const ColorsPage: NgnDocsPage = {
  kind: 'single',
  title: `Colors`,

  mdFile: 'guides/theming/colors/index.md',
  components: [NgnThemeColorsDemo],
};
