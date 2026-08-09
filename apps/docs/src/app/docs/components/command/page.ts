import { JigDocsCommandPlayground } from './playground';
import { Demo_Command_Base } from '../../../demos/command/base';
import { Demo_Command_Grouped } from '../../../demos/command/grouped';
import { Demo_Command_Routes } from '../../../demos/command/routes';
import { Demo_Command_Shortcuts } from '../../../demos/command/shortcuts';
import { i18nKeys } from '../../../utils/i18n-doc';

import type { JigDocsPage } from '../../../utils/page/types';

export const CommandPage: JigDocsPage = {
  title: `Command`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,
      title: 'Examples',
      mdFile: 'components/command/index.md',
      components: [
        Demo_Command_Base,
        Demo_Command_Grouped,
        Demo_Command_Routes,
        Demo_Command_Shortcuts,
      ],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: JigDocsCommandPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/command/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/command/a11y.md' },
    i18nKeys('command', {
      placeholder: 'Placeholder shown in the palette search field.',
      noResults: 'Message shown when the search matches no command.',
      label: 'Accessible name for the palette dialog.',
      hintClose: 'Footer legend label for the key that dismisses the palette.',
      hintSelect: 'Footer legend label for the keys that move the highlight.',
      hintConfirm: 'Footer legend label for the key that runs the highlighted command.',
    }),
  ],
};
