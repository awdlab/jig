import { Demo_Checkbox_Base } from '../../../demos/checkbox/base';
import { Demo_Checkbox_Indeterminate } from '../../../demos/checkbox/indeterminate';
import { NgnDocsPage } from '../../../utils/page/types';

export const CheckboxPage: NgnDocsPage = {
  title: `Checkbox`,
  kind: 'tabs',
  tabs: [
    {
      default: true,
      title: 'Examples',
      mdFile: 'components/checkbox/index.md',
      components: [Demo_Checkbox_Base, Demo_Checkbox_Indeterminate],
    },
    {
      title: 'API',
      mdFile: 'components/checkbox/api.md',
    },
  ],
};
