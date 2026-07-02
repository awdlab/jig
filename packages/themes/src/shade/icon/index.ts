import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { iconControlTemplate } from '@ngneers/controls-themes/templates/icon';

export const iconStyles = createThemePart({
  controlTemplate: iconControlTemplate,
  base: baseStyles.icon,
  dependencies: [],
  root: {
    // Icons stay undecorated and inherit `currentColor` via the base part (svg fill: currentColor).
    css: () => css``,
  },
});
