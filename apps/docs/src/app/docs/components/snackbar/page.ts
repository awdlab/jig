import { NgnDocsSnackbarPlayground } from './playground';
import { Demo_Snackbar_Actions } from '../../../demos/snackbar/actions';
import { Demo_Snackbar_Base } from '../../../demos/snackbar/base';
import { Demo_Snackbar_Closable } from '../../../demos/snackbar/closable';
import { Demo_Snackbar_Colors } from '../../../demos/snackbar/colors';
import { Demo_Snackbar_Icon } from '../../../demos/snackbar/icon';
import { Demo_Snackbar_Persistent } from '../../../demos/snackbar/persistent';
import { i18nKeys } from '../../../utils/i18n-doc';

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
        Demo_Snackbar_Actions,
      ],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: NgnDocsSnackbarPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/snackbar/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/snackbar/a11y.md' },
    i18nKeys('snackbar', {
      close: 'Accessible label for each notification’s dismiss button.',
      region: 'Label for the live region that wraps all notifications.',
      severity: {
        error: 'Screen-reader prefix announced before an error notification.',
        warning: 'Screen-reader prefix announced before a warning notification.',
        success: 'Screen-reader prefix announced before a success notification.',
        info: 'Screen-reader prefix announced before an info notification.',
      },
    }),
  ],
};
