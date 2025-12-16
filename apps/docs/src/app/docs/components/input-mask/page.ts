import { Demo_InputMask_Base } from '../../../demos/input-mask/base';
import { NgnDocsPage } from '../../../utils/page/types';

export const InputMaskPage: NgnDocsPage = {
  title: `Input Mask`,
  kind: 'tabs',
  tabs: [
    {
      default: true,
      title: 'Features',
      mdFile: 'components/input-mask/index.md',
      components: [Demo_InputMask_Base],
    },
    {
      title: 'API',
      mdFile: 'components/input-mask/api.md',
    },
  ],
};
