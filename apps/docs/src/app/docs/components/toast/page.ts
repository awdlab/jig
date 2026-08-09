import { JigDocsToastPlayground } from './playground';
import { Demo_Toast_Base } from '../../../demos/toast/base';
import { Demo_Toast_Closable } from '../../../demos/toast/closable';
import { Demo_Toast_Colors } from '../../../demos/toast/colors';
import { Demo_Toast_Icon } from '../../../demos/toast/icon';
import { Demo_Toast_Persistent } from '../../../demos/toast/persistent';
import { i18nKeys } from '../../../utils/i18n-doc';

import type { JigDocsPage } from '../../../utils/page/types';

export const ToastPage: JigDocsPage = {
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
      component: JigDocsToastPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/toast/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/toast/a11y.md' },
    i18nKeys('toast', {
      close: 'Accessible label for the button that dismisses a toast.',
      region: 'Accessible label for the live region that hosts the toasts.',
    }),
  ],
};
