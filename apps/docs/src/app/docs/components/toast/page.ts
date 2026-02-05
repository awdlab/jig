import { NgnDocsToastPlayground } from './playground';
import { Demo_Toast_Base } from '../../../demos/toast/base';
import { Demo_Toast_Closable } from '../../../demos/toast/closable';
import { Demo_Toast_Colors } from '../../../demos/toast/colors';
import { Demo_Toast_Icon } from '../../../demos/toast/icon';
import { Demo_Toast_Persistent } from '../../../demos/toast/persistent';

import type { NgnDocsPage } from '../../../utils/page/types';

export const ToastPage: NgnDocsPage = {
  title: `Toast`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/toast/index.md',
      components: [
        Demo_Toast_Base,
        Demo_Toast_Colors,
        Demo_Toast_Closable,
        Demo_Toast_Persistent,
        Demo_Toast_Icon,
      ],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: NgnDocsToastPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/toast/api.md' },
  ],
};
