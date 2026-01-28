import { NgnDocsSwitchPlayground } from './playground';
import { Demo_Switch_Base } from '../../../demos/switch/base';
import { Demo_Switch_States } from '../../../demos/switch/states';
import { NgnDocsPage } from '../../../utils/page/types';

export const SwitchPage: NgnDocsPage = {
  title: `Switch`,
  kind: 'tabs',
  tabs: [
    {
      default: true,
      title: 'Features',
      mdFile: 'components/switch/index.md',
      components: [Demo_Switch_Base, Demo_Switch_States],
    },
    {
      title: 'Playground',
      mdFile: 'components/switch/playground.md',
      components: [NgnDocsSwitchPlayground],
    },
    {
      title: 'API',
      mdFile: 'components/switch/api.md',
    },
  ],
};
