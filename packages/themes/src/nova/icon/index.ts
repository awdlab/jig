import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate } from '@ngneers/controls-themes/nova/base';
import { iconControlTemplate } from '@ngneers/controls-themes/templates/icon';

export const iconStyles = createThemePart({
  controlTemplate: iconControlTemplate,
  base: baseStyles.icon,
  dependencies: [colorsTemplate],
  root: {
    css: ({ v, c }) => css``,
  },
});
