import { NgnDocsSnackbarPlayground } from './playground';
import { Demo_Snackbar_Base } from '../../../demos/snackbar/base';
import { Demo_Snackbar_Closable } from '../../../demos/snackbar/closable';
import { Demo_Snackbar_Colors } from '../../../demos/snackbar/colors';
import { Demo_Snackbar_Icon } from '../../../demos/snackbar/icon';
import { Demo_Snackbar_Persistent } from '../../../demos/snackbar/persistent';

import type { NgnDocsPage } from '../../../utils/page/types';

export const SnackbarPage: NgnDocsPage = {
  title: `Snackbar`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/snackbar/index.md',
      components: [
        Demo_Snackbar_Base,
        Demo_Snackbar_Colors,
        Demo_Snackbar_Closable,
        Demo_Snackbar_Persistent,
        Demo_Snackbar_Icon,
      ],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: NgnDocsSnackbarPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/snackbar/api.md' },
  ],
};
