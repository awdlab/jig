import { Demo_ControlState_Flags } from '../../../../demos/control-state/flags';

import type { JigDocsPage } from '../../../../utils/page/types';

export const StateConceptPage: JigDocsPage = {
  kind: 'single',
  title: `State`,

  mdFile: 'guides/concepts/state/index.md',
  components: [Demo_ControlState_Flags],
};
