import { Demo_Rtl_Comparison } from '../../../../demos/_shared/rtl/comparison';
import { Demo_Rtl_Subtree } from '../../../../demos/_shared/rtl/subtree';

import type { JigDocsPage } from '../../../../utils/page/types';

export const RtlPage: JigDocsPage = {
  kind: 'single',
  title: `RTL`,

  mdFile: 'guides/concepts/rtl/index.md',
  components: [Demo_Rtl_Subtree, Demo_Rtl_Comparison],
};
