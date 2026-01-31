import { NgnDocsInputPlayground } from './playground';
import { Demo_Input_Base } from '../../../demos/input/base';
import { Demo_Input_Textarea } from '../../../demos/input/textarea';
import { NgnDocsPage } from '../../../utils/page/types';

export const InputPage: NgnDocsPage = {
  title: `Input`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/input/index.md',
      components: [Demo_Input_Base, Demo_Input_Textarea],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: NgnDocsInputPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/input/api.md' },
  ],
};
