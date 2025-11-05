import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { iconControlTemplate } from '@ngneers/controls-themes/templates/icon';

export const iconStyles = createThemePart({
  controlTemplate: iconControlTemplate,
  base: baseStyles.icon,
  dependencies: [],
  root: {
    css: ({ v, c }) => css``,
  },
});
