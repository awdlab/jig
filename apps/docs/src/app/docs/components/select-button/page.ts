import { AwdDocsSelectButtonPlayground } from './playground';
import { Demo_SelectButton_Base } from '../../../demos/select-button/base';
import { Demo_SelectButton_States } from '../../../demos/select-button/states';
import { Demo_SelectButton_Validation } from '../../../demos/select-button/validation';
import { i18nText } from '../../../utils/i18n-doc';

import type { AwdDocsPage } from '../../../utils/page/types';

export const SelectButtonPage: AwdDocsPage = {
  title: `Select Button`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/select-button/index.md',
      components: [Demo_SelectButton_Base, Demo_SelectButton_Validation, Demo_SelectButton_States],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: AwdDocsSelectButtonPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/select-button/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/select-button/a11y.md' },
    i18nText(
      "Select Button has no built-in translatable strings of its own. Any text it displays — the `label` of each item in the `options` array — comes from the values you provide, so translate those in your own application's i18n layer."
    ),
  ],
};
