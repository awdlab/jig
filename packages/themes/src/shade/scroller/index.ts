import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { colorsTemplate, sizesTemplate } from '@awdlab/jig-themes/shade/base';
import { scrollerControlTemplate } from '@awdlab/jig-themes/templates/scroller';

export const scrollerStyles = createThemePart({
  controlTemplate: scrollerControlTemplate,
  base: baseStyles.scroller,
  dependencies: [colorsTemplate, sizesTemplate],
  root: {
    // Structural scroll behaviour is handled by the base part; shade adds no decoration.
    css: () => css``,
  },
});
