import { NgnDocsChipPlayground } from './playground';
import { Demo_Chip_Actionable } from '../../../demos/chip/actionable';
import { Demo_Chip_Base } from '../../../demos/chip/base';
import { Demo_Chip_Closable } from '../../../demos/chip/closable';
import { i18nKeys } from '../../../utils/i18n-doc';

import type { NgnDocsPage } from '../../../utils/page/types';

export const ChipPage: NgnDocsPage = {
  title: `Chip`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/chip/index.md',
      components: [Demo_Chip_Base, Demo_Chip_Closable, Demo_Chip_Actionable],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: NgnDocsChipPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/chip/api.md' },
    { kind: 'single', title: 'Accessibility', mdFile: 'components/chip/a11y.md' },
    i18nKeys('chip', {
      close: 'Accessible label for the close button on a closable chip.',
    }),
  ],
};
