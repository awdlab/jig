import { JigDocsToolbarPlayground } from './playground';
import { i18nKeys } from '../../../utils/i18n-doc';
import { Demo_Toolbar_Base } from '../../../demos/toolbar/base';
import { Demo_Toolbar_Editor } from '../../../demos/toolbar/editor';
import { Demo_Toolbar_OverflowPopover } from '../../../demos/toolbar/overflow-popover';
import { Demo_Toolbar_OverflowWrap } from '../../../demos/toolbar/overflow-wrap';
import { Demo_Toolbar_Placements } from '../../../demos/toolbar/placements';
import { Demo_Toolbar_Priority } from '../../../demos/toolbar/priority';
import { Demo_Toolbar_TableActions } from '../../../demos/toolbar/table-actions';
import { Demo_Toolbar_Vertical } from '../../../demos/toolbar/vertical';

import type { JigDocsPage } from '../../../utils/page/types';

export const ToolbarPage: JigDocsPage = {
  title: `Toolbar`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/toolbar/index.md',
      components: [
        Demo_Toolbar_Base,
        Demo_Toolbar_Placements,
        Demo_Toolbar_OverflowWrap,
        Demo_Toolbar_OverflowPopover,
        Demo_Toolbar_Priority,
        Demo_Toolbar_Vertical,
        Demo_Toolbar_Editor,
        Demo_Toolbar_TableActions,
      ],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: JigDocsToolbarPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/toolbar/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/toolbar/a11y.md' },
    i18nKeys('toolbar', {
      overflow:
        'Accessible label for the trigger that opens the popover of collapsed toolbar items.',
    }),
  ],
};
