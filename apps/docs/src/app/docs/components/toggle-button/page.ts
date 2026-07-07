import { NgnDocsToggleButtonPlayground } from './playground';
import { Demo_ToggleButton_Base } from '../../../demos/toggle-button/base';
import { Demo_ToggleButton_FixedWidth } from '../../../demos/toggle-button/fixed-width';
import { Demo_ToggleButton_Icon } from '../../../demos/toggle-button/icon';
import { Demo_ToggleButton_Labels } from '../../../demos/toggle-button/labels';
import { Demo_ToggleButton_States } from '../../../demos/toggle-button/states';
import { Demo_ToggleButton_Validation } from '../../../demos/toggle-button/validation';

import type { NgnDocsPage } from '../../../utils/page/types';

export const ToggleButtonPage: NgnDocsPage = {
  title: `Toggle Button`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/toggle-button/index.md',
      components: [
        Demo_ToggleButton_Base,
        Demo_ToggleButton_Validation,
        Demo_ToggleButton_States,
        Demo_ToggleButton_Labels,
        Demo_ToggleButton_FixedWidth,
        Demo_ToggleButton_Icon,
      ],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: NgnDocsToggleButtonPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/toggle-button/api.md' },
  ],
};
