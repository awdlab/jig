import { JigDocsFilterFieldPlayground } from './playground';
import { Demo_FilterField_CustomTemplate } from '../../../demos/filter-field/custom-template';
import { Demo_FilterField_ApplyMode } from '../../../demos/filter-field/apply-mode';
import { Demo_FilterField_Base } from '../../../demos/filter-field/base';
import { Demo_FilterField_Custom } from '../../../demos/filter-field/custom';
import { Demo_FilterField_DataTypes } from '../../../demos/filter-field/datatypes';
import { Demo_FilterField_Headless } from '../../../demos/filter-field/headless';
import { Demo_FilterField_Inline } from '../../../demos/filter-field/inline';
import { Demo_FilterField_Multiple } from '../../../demos/filter-field/multiple';
import { Demo_FilterField_Operators } from '../../../demos/filter-field/operators';
import { Demo_FilterField_Validation } from '../../../demos/filter-field/validation';
import { i18nKeys } from '../../../utils/i18n-doc';

import type { JigDocsPage } from '../../../utils/page/types';

export const FilterFieldPage: JigDocsPage = {
  title: `Filter Field`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/filter-field/index.md',
      components: [
        Demo_FilterField_Base,
        Demo_FilterField_Validation,
        Demo_FilterField_Inline,
        Demo_FilterField_Headless,
        Demo_FilterField_DataTypes,
        Demo_FilterField_Operators,
        Demo_FilterField_Custom,
        Demo_FilterField_Multiple,
        Demo_FilterField_ApplyMode,
        Demo_FilterField_CustomTemplate,
      ],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: JigDocsFilterFieldPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/filter-field/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/filter-field/a11y.md' },
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
          notContains: 'Operator label: value does not contain the target substring.',
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
