import { NgnDocsTreePlayground } from './playground';
import { Demo_Tree_Base } from '../../../demos/tree/base';
import { Demo_Tree_Disabled } from '../../../demos/tree/disabled';
import { Demo_Tree_Events } from '../../../demos/tree/events';
import { Demo_Tree_Filter } from '../../../demos/tree/filter';
import { Demo_Tree_Lazy } from '../../../demos/tree/lazy';
import { Demo_Tree_Storage } from '../../../demos/tree/storage';
import { Demo_Tree_Templates } from '../../../demos/tree/templates';
import { Demo_Tree_Validation } from '../../../demos/tree/validation';
import { Demo_Tree_Virtual } from '../../../demos/tree/virtual';
import { i18nKeys } from '../../../utils/i18n-doc';

import type { NgnDocsPage } from '../../../utils/page/types';

export const TreePage: NgnDocsPage = {
  title: `Tree`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,
      title: 'Examples',
      mdFile: 'components/tree/index.md',
      components: [
        Demo_Tree_Base,
        Demo_Tree_Validation,
        Demo_Tree_Templates,
        Demo_Tree_Events,
        Demo_Tree_Filter,
        Demo_Tree_Disabled,
        Demo_Tree_Lazy,
        Demo_Tree_Storage,
        Demo_Tree_Virtual,
      ],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: NgnDocsTreePlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/tree/api.md' },
    { kind: 'single', title: 'Accessibility', mdFile: 'components/tree/a11y.md' },
    i18nKeys('tree', {
      noItemsFound: 'Empty-state message shown when no nodes match the current filter.',
    }),
  ],
};
