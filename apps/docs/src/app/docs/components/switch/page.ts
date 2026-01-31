import { NgnDocsSwitchPlayground } from './playground';
import { Demo_Switch_Base } from '../../../demos/switch/base';
import { Demo_Switch_States } from '../../../demos/switch/states';
import { NgnDocsPage } from '../../../utils/page/types';

export const SwitchPage: NgnDocsPage = {
  title: `Switch`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/switch/index.md',
      components: [Demo_Switch_Base, Demo_Switch_States],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: NgnDocsSwitchPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/switch/api.md' },
  ],
};
