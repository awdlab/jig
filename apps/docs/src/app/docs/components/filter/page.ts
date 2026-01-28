import { NgnDocsFilterPlayground } from './playground';
import { Demo_Filter_Base } from '../../../demos/filter/base';
import { Demo_Filter_Custom } from '../../../demos/filter/custom';
import { Demo_Filter_DataTypes } from '../../../demos/filter/datatypes';
import { Demo_Filter_Headless } from '../../../demos/filter/headless';
import { Demo_Filter_Inline } from '../../../demos/filter/inline';
import { Demo_Filter_Multiple } from '../../../demos/filter/multiple';
import { NgnDocsPage } from '../../../utils/page/types';

export const FilterPage: NgnDocsPage = {
  title: `Filter`,
  kind: 'tabs',
  tabs: [
    {
      default: true,
      title: 'Features',
      mdFile: 'components/filter/index.md',
      components: [
        Demo_Filter_Base,
        Demo_Filter_Inline,
        Demo_Filter_Headless,
        Demo_Filter_DataTypes,
        Demo_Filter_Custom,
        Demo_Filter_Multiple,
      ],
    },
    {
      title: 'Playground',
      mdFile: 'components/filter/playground.md',
      components: [NgnDocsFilterPlayground],
    },
    {
      title: 'API',
      mdFile: 'components/filter/api.md',
    },
  ],
};
