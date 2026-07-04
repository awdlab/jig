import { NgnDocsUploadPlayground } from './playground';
import { Demo_Upload_Base } from '../../../demos/upload/base';
import { Demo_Upload_Confirm } from '../../../demos/upload/confirm';
import { Demo_Upload_Interaction } from '../../../demos/upload/interaction';
import { Demo_Upload_Manual } from '../../../demos/upload/manual';
import { Demo_Upload_Position } from '../../../demos/upload/position';
import { Demo_Upload_States } from '../../../demos/upload/states';

import type { NgnDocsPage } from '../../../utils/page/types';

export const UploadPage: NgnDocsPage = {
  title: `Upload`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/upload/index.md',
      components: [
        Demo_Upload_Base,
        Demo_Upload_Confirm,
        Demo_Upload_Manual,
        Demo_Upload_Interaction,
        Demo_Upload_Position,
        Demo_Upload_States,
      ],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: NgnDocsUploadPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/upload/api.md' },
  ],
};
