import { JigDocsToggleButtonPlayground } from './playground';
import { Demo_ToggleButton_Base } from '../../../demos/toggle-button/base';
import { Demo_ToggleButton_FixedWidth } from '../../../demos/toggle-button/fixed-width';
import { Demo_ToggleButton_Icon } from '../../../demos/toggle-button/icon';
import { Demo_ToggleButton_Labels } from '../../../demos/toggle-button/labels';
import { Demo_ToggleButton_States } from '../../../demos/toggle-button/states';
import { Demo_ToggleButton_Validation } from '../../../demos/toggle-button/validation';
import { i18nText } from '../../../utils/i18n-doc';

import type { JigDocsPage } from '../../../utils/page/types';

export const ToggleButtonPage: JigDocsPage = {
  title: `Toggle Button`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/toggle-button/index.md',
      components: [
        Demo_ToggleButton_Base,
        Demo_ToggleButton_Validation,
        Demo_ToggleButton_States,
        Demo_ToggleButton_Labels,
        Demo_ToggleButton_FixedWidth,
        Demo_ToggleButton_Icon,
      ],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: JigDocsToggleButtonPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/toggle-button/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/toggle-button/a11y.md' },
    i18nText(
      "Toggle Button has no built-in translatable strings of its own. Any text it displays — the `label`, `labelOn`, and `labelOff` you supply — comes from the values you provide, so translate those in your own application's i18n layer."
    ),
  ],
};
