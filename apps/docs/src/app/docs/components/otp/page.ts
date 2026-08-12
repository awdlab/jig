import { JigDocsOtpPlayground } from './playground';
import { Demo_Otp_Base } from '../../../demos/otp/base';
import { Demo_Otp_Length } from '../../../demos/otp/length';
import { Demo_Otp_Mask } from '../../../demos/otp/mask';
import { Demo_Otp_Validation } from '../../../demos/otp/validation';
import { i18nKeys } from '../../../utils/i18n-doc';

import type { JigDocsPage } from '../../../utils/page/types';

export const OtpPage: JigDocsPage = {
  title: `OTP`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,
      title: 'Examples',
      mdFile: 'components/otp/index.md',
      components: [Demo_Otp_Base, Demo_Otp_Mask, Demo_Otp_Length, Demo_Otp_Validation],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: JigDocsOtpPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/otp/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/otp/a11y.md' },
    i18nKeys('otp', {
      cellLabel:
        'Accessible name for each character cell, announcing its position (e.g. "Character 3 of 6").',
      errors: {
        required: 'Validation message shown when the code is incomplete.',
      },
    }),
  ],
};
