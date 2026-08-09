import { Demo_DarkMode_Toggle } from '../../../../demos/dark-mode/toggle';

import type { JigDocsPage } from '../../../../utils/page/types';

export const DarkModePage: JigDocsPage = {
  kind: 'single',
  title: `Dark Mode`,

  mdFile: 'guides/theming/dark-mode/index.md',
  components: [Demo_DarkMode_Toggle],
};
