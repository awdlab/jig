import { NgnDocsChipPlayground } from './playground';
import { Demo_Chip_Actionable } from '../../../demos/chip/actionable';
import { Demo_Chip_Base } from '../../../demos/chip/base';
import { Demo_Chip_Closable } from '../../../demos/chip/closable';
import { NgnDocsPage } from '../../../utils/page/types';

export const ChipPage: NgnDocsPage = {
  title: `Chip`,
  kind: 'tabs',
  tabs: [
    {
      default: true,
      title: 'Features',
      mdFile: 'components/chip/index.md',
      components: [Demo_Chip_Base, Demo_Chip_Closable, Demo_Chip_Actionable],
    },
    {
      title: 'Playground',
      mdFile: 'components/chip/playground.md',
      components: [NgnDocsChipPlayground],
    },
    {
      title: 'API',
      mdFile: 'components/chip/api.md',
    },
  ],
};
