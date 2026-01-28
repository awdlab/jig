import { NgnDocsInputMaskPlayground } from './playground';
import { Demo_InputMask_Base } from '../../../demos/input-mask/base';
import { Demo_InputMask_InputField } from '../../../demos/input-mask/input-field';
import { NgnDocsPage } from '../../../utils/page/types';

export const InputMaskPage: NgnDocsPage = {
  title: `Input Mask`,
  kind: 'tabs',
  tabs: [
    {
      default: true,
      title: 'Features',
      mdFile: 'components/input-mask/index.md',
      components: [Demo_InputMask_Base, Demo_InputMask_InputField],
    },
    {
      title: 'Playground',
      mdFile: 'components/input-mask/playground.md',
      components: [NgnDocsInputMaskPlayground],
    },
    {
      title: 'API',
      mdFile: 'components/input-mask/api.md',
    },
  ],
};
