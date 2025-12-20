import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { scrollerControlTemplate } from '@ngneers/controls-themes/templates/scroller';

export const scrollerStyles = createThemePart({
  controlTemplate: scrollerControlTemplate,
  base: baseStyles.scroller,
  dependencies: [colorsTemplate, sizesTemplate],
  root: {
    css: ({ v, c }) => css``,
  },
});
