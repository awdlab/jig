import { AwdThemeColorsDemo } from '../../../../page-components/colors';

import type { AwdDocsPage } from '../../../../utils/page/types';

export const ColorsPage: AwdDocsPage = {
  kind: 'single',
  title: `Colors`,

  mdFile: 'guides/theming/colors/index.md',
  components: [AwdThemeColorsDemo],
};
