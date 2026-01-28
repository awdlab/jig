import { NgnDocsCheckboxPlayground } from './playground';
import { Demo_Checkbox_Base } from '../../../demos/checkbox/base';
import { Demo_Checkbox_Indeterminate } from '../../../demos/checkbox/indeterminate';
import { Demo_Checkbox_States } from '../../../demos/checkbox/states';
import { NgnDocsPage } from '../../../utils/page/types';

export const CheckboxPage: NgnDocsPage = {
  title: `Checkbox`,
  kind: 'tabs',
  tabs: [
    {
      default: true,
      title: 'Features',
      mdFile: 'components/checkbox/index.md',
      components: [Demo_Checkbox_Base, Demo_Checkbox_Indeterminate, Demo_Checkbox_States],
    },
    {
      title: 'Playground',
      mdFile: 'components/checkbox/playground.md',
      components: [NgnDocsCheckboxPlayground],
    },
    {
      title: 'API',
      mdFile: 'components/checkbox/api.md',
    },
  ],
};
