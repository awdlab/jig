import { COMPONENT_GROUPS } from './components';
import { GUIDE_GROUPS } from './guides';

import type { JigDocsTab } from '../utils/page/types';

/**
 * The top-level documentation tabs, in switcher order. The first page of the
 * first tab (Guides → Introduction) is the docs landing page.
 */
export const ALL_DOCS_TABS: JigDocsTab[] = [
  {
    title: 'Guides',
    tabTitle: 'Guides',
    icon: 'book',
    groups: GUIDE_GROUPS,
  },
  {
    title: 'Components',
    tabTitle: 'Component',
    icon: 'grid',
    groups: COMPONENT_GROUPS,
  },
];
