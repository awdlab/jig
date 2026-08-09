import { AwdDocsSelectPlayground } from './playground';
import { Demo_Select_Base } from '../../../demos/select/base';
import { Demo_Select_DisabledItems } from '../../../demos/select/disabled-items';
import { Demo_Select_Editable } from '../../../demos/select/editable';
import { Demo_Select_EditableCustom } from '../../../demos/select/editable-custom';
import { Demo_Select_Filter } from '../../../demos/select/filter';
import { Demo_Select_Grouped } from '../../../demos/select/grouped';
import { Demo_Select_Multiple } from '../../../demos/select/multiple';
import { Demo_Select_Placeholder } from '../../../demos/select/placeholder';
import { Demo_Select_States } from '../../../demos/select/states';
import { Demo_Select_Templates } from '../../../demos/select/templates';
import { Demo_Select_Validation } from '../../../demos/select/validation';
import { i18nKeys } from '../../../utils/i18n-doc';

import type { AwdDocsPage } from '../../../utils/page/types';

export const SelectPage: AwdDocsPage = {
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
        Demo_Select_Placeholder,
        Demo_Select_Validation,
        Demo_Select_Filter,
        Demo_Select_Grouped,
        Demo_Select_Templates,
        Demo_Select_Editable,
        Demo_Select_EditableCustom,
        Demo_Select_Multiple,
        Demo_Select_States,
        Demo_Select_DisabledItems,
      ],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: AwdDocsSelectPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/select/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/select/a11y.md' },
    i18nKeys(
      'select',
      {
        filterOptions:
          'Accessible label and placeholder for the input that filters the dropdown options.',
      },
      ['list-box']
    ),
  ],
};
