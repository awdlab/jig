import { JigDocsDropdownListPlayground } from './playground';
import { Demo_DropdownList_AnchorWidth } from '../../../demos/dropdown-list/anchor-width';
import { Demo_DropdownList_Base } from '../../../demos/dropdown-list/base';
import { Demo_DropdownList_Grouped } from '../../../demos/dropdown-list/grouped';
import { Demo_DropdownList_Templates } from '../../../demos/dropdown-list/templates';
import { i18nText } from '../../../utils/i18n-doc';

import type { JigDocsPage } from '../../../utils/page/types';

export const DropdownListPage: JigDocsPage = {
  title: `Dropdown List`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/dropdown-list/index.md',
      components: [
        Demo_DropdownList_Base,
        Demo_DropdownList_AnchorWidth,
        Demo_DropdownList_Grouped,
        Demo_DropdownList_Templates,
      ],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: JigDocsDropdownListPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/dropdown-list/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/dropdown-list/a11y.md' },
    i18nText(
      'The dropdown list ships no strings of its own. The list it renders comes from [list-box](/components/list-box), whose empty-state text is translated there.'
    ),
  ],
};
