import { NgnDocsFilterPlayground } from './playground';
import { Demo_Filter_ApplyMode } from '../../../demos/filter/apply-mode';
import { Demo_Filter_Base } from '../../../demos/filter/base';
import { Demo_Filter_Custom } from '../../../demos/filter/custom';
import { Demo_Filter_DataTypes } from '../../../demos/filter/datatypes';
import { Demo_Filter_Headless } from '../../../demos/filter/headless';
import { Demo_Filter_Inline } from '../../../demos/filter/inline';
import { Demo_Filter_Multiple } from '../../../demos/filter/multiple';
import { Demo_Filter_Validation } from '../../../demos/filter/validation';
import { i18nKeys } from '../../../utils/i18n-doc';

import type { NgnDocsPage } from '../../../utils/page/types';

export const FilterPage: NgnDocsPage = {
  title: `Filter`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/filter/index.md',
      components: [
        Demo_Filter_Base,
        Demo_Filter_Validation,
        Demo_Filter_Inline,
        Demo_Filter_Headless,
        Demo_Filter_DataTypes,
        Demo_Filter_Custom,
        Demo_Filter_Multiple,
        Demo_Filter_ApplyMode,
      ],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: NgnDocsFilterPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/filter/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/filter/a11y.md' },
    i18nKeys(
      'filter',
      {
        noFilter: 'Summary text shown when no filter condition is active.',
        addCondition: 'Label for the button that appends a new filter condition row.',
        removeCondition: 'Accessible label for the button that removes a condition row.',
        operator: 'Label for the operator selection control on a condition.',
        value: 'Accessible label for the value input on a condition.',
        clear: 'Label for the button that clears the active filter.',
        apply: 'Label for the button that applies the pending conditions.',
        cancel: 'Label for the button that discards pending changes.',
        matchModeLabel: 'Label describing the all/any match-mode toggle.',
        match: {
          all: 'Match-mode option requiring every condition to match.',
          any: 'Match-mode option requiring any condition to match.',
          and: 'Connector shown between conditions when matching all.',
          or: 'Connector shown between conditions when matching any.',
        },
        selected: 'Suffix appended to the count in the single-select summary.',
        conditions: 'Suffix appended to the count in the multi-condition summary.',
        operators: {
          isEqual: 'Operator label: value equals the target.',
          isNotEqual: 'Operator label: value differs from the target.',
          contains: 'Operator label: value contains the target substring.',
          startsWith: 'Operator label: value begins with the target.',
          endsWith: 'Operator label: value ends with the target.',
          in: 'Operator label: value is one of a set.',
          isEmpty: 'Operator label: value is empty.',
          isNotEmpty: 'Operator label: value is not empty.',
          greaterThan: 'Operator label: value is greater than the target.',
          greaterThanOrEqual: 'Operator label: value is greater than or equal to the target.',
          lessThan: 'Operator label: value is less than the target.',
          lessThanOrEqual: 'Operator label: value is less than or equal to the target.',
          after: 'Operator label: date is after the target.',
          onOrAfter: 'Operator label: date is on or after the target.',
          before: 'Operator label: date is before the target.',
          onOrBefore: 'Operator label: date is on or before the target.',
          isTrue: 'Operator label for the boolean true condition.',
          isFalse: 'Operator label for the boolean false condition.',
          custom: 'Operator label for a custom, user-defined condition.',
        },
      },
      ['calendar']
    ),
  ],
};
