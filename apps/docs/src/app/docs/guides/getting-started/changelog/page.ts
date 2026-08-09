import { JigDocsChangelog } from './changelog';

import type { JigDocsPage } from '../../../../utils/page/types';

export const ChangelogPage: JigDocsPage = {
  kind: 'component',
  title: `Changelog`,

  component: JigDocsChangelog,
};
