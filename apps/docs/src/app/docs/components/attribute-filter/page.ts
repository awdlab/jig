import { JigDocsAttributeFilterPlayground } from './playground';
import { Demo_AttributeFilter_ApplyMode } from '../../../demos/attribute-filter/apply-mode';
import { Demo_AttributeFilter_Base } from '../../../demos/attribute-filter/base';
import { Demo_AttributeFilter_DataTypes } from '../../../demos/attribute-filter/datatypes';
import { Demo_AttributeFilter_Headless } from '../../../demos/attribute-filter/headless';
import { Demo_AttributeFilter_Inline } from '../../../demos/attribute-filter/inline';
import { Demo_AttributeFilter_Multiple } from '../../../demos/attribute-filter/multiple';
import { i18nKeys } from '../../../utils/i18n-doc';

import type { JigDocsPage } from '../../../utils/page/types';

export const AttributeFilterPage: JigDocsPage = {
  title: `Attribute Filter`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/attribute-filter/index.md',
      components: [
        Demo_AttributeFilter_Base,
        Demo_AttributeFilter_Inline,
        Demo_AttributeFilter_Headless,
        Demo_AttributeFilter_DataTypes,
        Demo_AttributeFilter_Multiple,
        Demo_AttributeFilter_ApplyMode,
      ],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: JigDocsAttributeFilterPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/attribute-filter/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/attribute-filter/a11y.md' },
    i18nKeys(
      'attributeFilter',
      {
        attribute: 'Label for the select that picks which attribute a condition filters on.',
        chip: 'Template for a condition chip with a value. Receives attribute, operator and value.',
        chipNoValue:
          'Template for a condition chip whose operator takes no value. Receives attribute and operator.',
      },
      ['filter', 'calendar']
    ),
  ],
};
