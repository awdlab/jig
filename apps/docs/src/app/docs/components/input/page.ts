import { Demo_Input_Base } from '../../../demos/input/base';
import { Demo_Input_InputField } from '../../../demos/input/input-field';
import { Demo_Input_Textarea } from '../../../demos/input/textarea';
import { Demo_Input_TextareaInputField } from '../../../demos/input/textarea-input-field';
import { NgnDocsPage } from '../../../utils/page/types';

export const InputPage: NgnDocsPage = {
  title: `Input`,
  kind: 'tabs',
  tabs: [
    {
      default: true,
      title: 'Examples',
      mdFile: 'components/input/index.md',
      components: [
        Demo_Input_Base,
        Demo_Input_InputField,
        Demo_Input_Textarea,
        Demo_Input_TextareaInputField,
      ],
    },
    {
      title: 'API',
      mdFile: 'components/input/api.md',
    },
  ],
};
