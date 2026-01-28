import { NgnDocsToastPlayground } from './playground';
import { Demo_Toast_Base } from '../../../demos/toast/base';
import { Demo_Toast_Closable } from '../../../demos/toast/closable';
import { Demo_Toast_Colors } from '../../../demos/toast/colors';
import { Demo_Toast_Icon } from '../../../demos/toast/icon';
import { Demo_Toast_Persistent } from '../../../demos/toast/persistent';
import { NgnDocsPage } from '../../../utils/page/types';

export const ToastPage: NgnDocsPage = {
  title: `Toast`,
  kind: 'tabs',
  tabs: [
    {
      default: true,
      title: 'Features',
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
      title: 'Playground',
      mdFile: 'components/toast/playground.md',
      components: [NgnDocsToastPlayground],
    },
    {
      title: 'API',
      mdFile: 'components/toast/api.md',
    },
  ],
};
