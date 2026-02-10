import { NgnDocsSelectButtonPlayground } from './playground';
import { Demo_SelectButton_Base } from '../../../demos/select-button/base';
import { Demo_SelectButton_States } from '../../../demos/select-button/states';

import type { NgnDocsPage } from '../../../utils/page/types';

export const SelectButtonPage: NgnDocsPage = {
  title: `Select Button`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/select-button/index.md',
      components: [Demo_SelectButton_Base, Demo_SelectButton_States],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: NgnDocsSelectButtonPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/select-button/api.md' },
  ],
};
