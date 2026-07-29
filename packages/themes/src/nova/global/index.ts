import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { globalControlTemplate } from '@ngneers/controls-themes/templates/global';

export const globalStyles = createThemePart({
  controlTemplate: globalControlTemplate,
  base: baseStyles.global,
  dependencies: [],
  root: {
    css: () => css``,
  },
});
