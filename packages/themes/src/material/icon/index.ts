import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { colorsTemplate } from '@awdlab/jig-themes/material/base';
import { iconControlTemplate } from '@awdlab/jig-themes/templates/icon';

export const iconStyles = createThemePart({
  controlTemplate: iconControlTemplate,
  base: baseStyles.icon,
  dependencies: [colorsTemplate],
  root: {
    css: ({ v, c }) => css``,
  },
});
