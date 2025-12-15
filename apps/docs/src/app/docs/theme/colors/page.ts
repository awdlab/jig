import { NgnThemeColorsDemo } from '../../../page-components/colors';
import { NgnDocsPage } from '../../../utils/page/types';

export const ColorsPage: NgnDocsPage = {
  kind: 'single',
  title: `Colors`,

  mdFile: 'theme/colors/index.md',
  components: [NgnThemeColorsDemo],
};
