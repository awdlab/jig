import { Demo_InputField_Base } from '../../../demos/input-field/base';
import { Demo_InputField_Clear } from '../../../demos/input-field/clear';
import { Demo_InputField_States } from '../../../demos/input-field/states';
import { Demo_InputField_Textarea } from '../../../demos/input-field/textarea';
import { NgnDocsPage } from '../../../utils/page/types';

export const InputFieldPage: NgnDocsPage = {
  title: `Input Field`,
  kind: 'tabs',
  tabs: [
    {
      default: true,
      title: 'Features',
      mdFile: 'components/input-field/index.md',
      components: [
        Demo_InputField_Base,
        Demo_InputField_Textarea,
        Demo_InputField_Clear,
        Demo_InputField_States,
      ],
    },
    {
      title: 'API',
      mdFile: 'components/input-field/api.md',
    },
  ],
};
