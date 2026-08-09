import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { globalControlTemplate } from '@awdlab/jig-themes/templates/global';

export const globalStyles = createThemePart({
  controlTemplate: globalControlTemplate,
  base: baseStyles.global,
  dependencies: [],
  root: {
    css: () => css``,
  },
});
