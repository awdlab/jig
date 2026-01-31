import { NgnDocsSelectPlayground } from './playground';
import { Demo_Select_Base } from '../../../demos/select/base';
import { Demo_Select_Editable } from '../../../demos/select/editable';
import { Demo_Select_EditableCustom } from '../../../demos/select/editable-custom';
import { Demo_Select_Filter } from '../../../demos/select/filter';
import { Demo_Select_Grouped } from '../../../demos/select/grouped';
import { Demo_Select_Multiple } from '../../../demos/select/multiple';
import { Demo_Select_States } from '../../../demos/select/states';
import { Demo_Select_Templates } from '../../../demos/select/templates';
import { NgnDocsPage } from '../../../utils/page/types';

export const SelectPage: NgnDocsPage = {
  title: `Select`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/select/index.md',
      components: [
        Demo_Select_Base,
        Demo_Select_Filter,
        Demo_Select_Grouped,
        Demo_Select_Templates,
        Demo_Select_Editable,
        Demo_Select_EditableCustom,
        Demo_Select_Multiple,
        Demo_Select_States,
      ],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: NgnDocsSelectPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/select/api.md' },
  ],
};
