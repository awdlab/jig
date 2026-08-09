import { JigDocsStatePlayground } from './playground';
import { Demo_State_Button } from '../../../demos/state/button';
import { Demo_State_InputField } from '../../../demos/state/input-field';
import { Demo_State_Interactive } from '../../../demos/state/interactive';
import { i18nKeys } from '../../../utils/i18n-doc';

import type { JigDocsPage } from '../../../utils/page/types';

export const StatePage: JigDocsPage = {
  title: `State`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/state/index.md',
      components: [Demo_State_Button, Demo_State_InputField, Demo_State_Interactive],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: JigDocsStatePlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/state/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/state/a11y.md' },
    i18nKeys('state', {
      loading: 'Screen-reader label announcing the loading state kind.',
      success: 'Screen-reader label announcing the success state kind.',
      warning: 'Screen-reader label announcing the warning state kind.',
      error: 'Screen-reader label announcing the error state kind.',
      cancelled: 'Screen-reader label announcing the cancelled state kind.',
    }),
  ],
};
