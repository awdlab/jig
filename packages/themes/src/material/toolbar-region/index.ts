import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@awdlab/jig-themes/material/base';
import { toolbarRegionControlTemplate } from '@awdlab/jig-themes/templates/toolbar-region';

export const toolbarRegionStyles = createThemePart({
  controlTemplate: toolbarRegionControlTemplate,
  base: baseStyles.toolbarRegion,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ c }) => css`
      /* Items sit adjacent, so a focused item's ring would be painted over by
         its neighbour. Lift the focused item above its siblings. */
      ${c('item')}:focus-within {
        position: relative;
        z-index: 1;
      }
    `,
  },
});
