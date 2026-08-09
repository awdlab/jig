import { Demo_ControlState_Flags } from '../../../../demos/control-state/flags';

import type { NgnDocsPage } from '../../../../utils/page/types';

export const StateConceptPage: NgnDocsPage = {
  kind: 'single',
  title: `State`,

  mdFile: 'guides/concepts/state/index.md',
  components: [Demo_ControlState_Flags],
};
