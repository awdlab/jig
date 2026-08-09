import { AwdDocsUploadPlayground } from './playground';
import { Demo_Upload_Base } from '../../../demos/upload/base';
import { Demo_Upload_Confirm } from '../../../demos/upload/confirm';
import { Demo_Upload_Interaction } from '../../../demos/upload/interaction';
import { Demo_Upload_Manual } from '../../../demos/upload/manual';
import { Demo_Upload_Position } from '../../../demos/upload/position';
import { Demo_Upload_States } from '../../../demos/upload/states';
import { i18nKeys } from '../../../utils/i18n-doc';

import type { AwdDocsPage } from '../../../utils/page/types';

export const UploadPage: AwdDocsPage = {
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
      component: AwdDocsUploadPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/upload/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/upload/a11y.md' },
    i18nKeys('upload', {
      upload: 'Label for the main upload trigger button.',
      uploadNamed:
        'Accessible label for a per-item upload action; interpolates {{ name }} with the file name.',
      retryNamed:
        'Accessible label for a per-item retry action; interpolates {{ name }} with the file name.',
      cancelNamed:
        'Accessible label for a per-item cancel action; interpolates {{ name }} with the file name.',
      removeNamed:
        'Accessible label for a per-item remove action; interpolates {{ name }} with the file name.',
      progressNamed:
        'Accessible label for a per-item progress indicator; interpolates {{ name }} with the file name.',
    }),
  ],
};
