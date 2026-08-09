import { NgnDocsColorPickerPlayground } from './playground';
import { Demo_ColorPicker_Base } from '../../../demos/color-picker/base';
import { Demo_ColorPicker_Inline } from '../../../demos/color-picker/inline';
import { Demo_ColorPicker_Swatches } from '../../../demos/color-picker/swatches';

import type { NgnDocsPage } from '../../../utils/page/types';

export const ColorPickerPage: NgnDocsPage = {
  title: `Color Picker`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,
      title: 'Examples',
      mdFile: 'components/color-picker/index.md',
      components: [Demo_ColorPicker_Base, Demo_ColorPicker_Inline, Demo_ColorPicker_Swatches],
    },
    { kind: 'component', title: 'Playground', component: NgnDocsColorPickerPlayground },
    { kind: 'single', title: 'API', mdFile: 'components/color-picker/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/color-picker/a11y.md' },
  ],
};
