import { Demo_Errors_Custom } from '../../../demos/errors/custom';
import { Demo_Errors_Messages } from '../../../demos/errors/messages';
import { Demo_Errors_Reactive } from '../../../demos/errors/reactive';
import { Demo_Errors_SignalForms } from '../../../demos/errors/signal-forms';
import { i18nKeys } from '../../../utils/i18n-doc';

import type { JigDocsPage } from '../../../utils/page/types';

export const ErrorsPage: JigDocsPage = {
  title: `Errors`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/errors/index.md',
      components: [
        Demo_Errors_Reactive,
        Demo_Errors_SignalForms,
        Demo_Errors_Messages,
        Demo_Errors_Custom,
      ],
    },
    { kind: 'single', title: 'API', mdFile: 'components/errors/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/errors/a11y.md' },
    i18nKeys(
      'errors',
      {
        pending: 'Shown while an async validator is running, regardless of `ngnErrorsShowOn`.',
        required: 'Default message for the `required` error.',
        email: 'Default message for the `email` error.',
        minlength:
          'Classic Angular `minlength` error. Interpolates `requiredLength` from the error value.',
        maxlength:
          'Classic Angular `maxlength` error. Interpolates `requiredLength` from the error value.',
        minLength: 'Signal-forms `minLength` error kind. Interpolates `minLength`.',
        maxLength: 'Signal-forms `maxLength` error kind. Interpolates `maxLength`.',
        min: 'Default message for the `min` error. Interpolates `min`.',
        max: 'Default message for the `max` error. Interpolates `max`.',
        pattern: 'Default message for the `pattern` error.',
      },
      ['hint']
    ),
  ],
};
