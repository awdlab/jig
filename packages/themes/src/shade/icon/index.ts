import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { iconControlTemplate } from '@awdlab/jig-themes/templates/icon';

export const iconStyles = createThemePart({
  controlTemplate: iconControlTemplate,
  base: baseStyles.icon,
  dependencies: [],
  root: {
    // Icons stay undecorated and inherit `currentColor` via the base part (svg fill: currentColor).
    css: () => css``,
  },
});
