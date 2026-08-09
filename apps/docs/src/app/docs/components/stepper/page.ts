import { Demo_Stepper_Base } from '../../../demos/stepper/base';
import { Demo_Stepper_Linear } from '../../../demos/stepper/linear';

import type { AwdDocsPage } from '../../../utils/page/types';

export const StepperPage: AwdDocsPage = {
  title: `Stepper`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,
      title: 'Examples',
      mdFile: 'components/stepper/index.md',
      components: [Demo_Stepper_Base, Demo_Stepper_Linear],
    },
    { kind: 'single', title: 'API', mdFile: 'components/stepper/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/stepper/a11y.md' },
  ],
};
