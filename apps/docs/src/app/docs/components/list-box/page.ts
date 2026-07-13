import { NgnDocsListBoxPlayground } from './playground';
import { Demo_ListBox_Base } from '../../../demos/list-box/base';
import { Demo_ListBox_Filter } from '../../../demos/list-box/filter';
import { Demo_ListBox_Grouped } from '../../../demos/list-box/grouped';
import { Demo_ListBox_Multiple } from '../../../demos/list-box/multiple';
import { Demo_ListBox_Templates } from '../../../demos/list-box/templates';
import { Demo_ListBox_Validation } from '../../../demos/list-box/validation';
import { Demo_ListBox_Value } from '../../../demos/list-box/value';
import { Demo_ListBox_Virtual } from '../../../demos/list-box/virtual';
import { i18nKeys } from '../../../utils/i18n-doc';

import type { NgnDocsPage } from '../../../utils/page/types';

export const ListBoxPage: NgnDocsPage = {
  title: `List Box`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/list-box/index.md',
      components: [
        Demo_ListBox_Base,
        Demo_ListBox_Validation,
        Demo_ListBox_Grouped,
        Demo_ListBox_Templates,
        Demo_ListBox_Value,
        Demo_ListBox_Virtual,
        Demo_ListBox_Multiple,
        Demo_ListBox_Filter,
      ],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: NgnDocsListBoxPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/list-box/api.md' },
    { kind: 'single', title: 'Accessibility', mdFile: 'components/list-box/a11y.md' },
    i18nKeys('listBox', {
      noItemsFound: 'Empty-state message shown when there are no items to display.',
    }),
  ],
};
