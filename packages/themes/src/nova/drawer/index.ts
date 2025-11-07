import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import {
  animationTemplate,
  colorsTemplate,
  shadowTemplate,
  sizesTemplate,
} from '@ngneers/controls-themes/nova/base';
import { drawerControlTemplate } from '@ngneers/controls-themes/templates/drawer';

export const drawerStyles = createThemePart({
  controlTemplate: drawerControlTemplate,
  base: baseStyles.drawer,
  dependencies: [colorsTemplate, sizesTemplate, animationTemplate, shadowTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c()} {
      }
    `,
  },
});
