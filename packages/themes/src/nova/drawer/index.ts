import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import {
  animationTemplate,
  colorsTemplate,
  fontTemplate,
  shadowTemplate,
  sizesTemplate,
} from '@ngneers/controls-themes/nova/base';
import { drawerControlTemplate } from '@ngneers/controls-themes/templates/drawer';

export const drawerStyles = createThemePart({
  controlTemplate: drawerControlTemplate,
  base: baseStyles.drawer,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate, animationTemplate, shadowTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c()} {
        box-shadow: ${v('shadow.lg')};
        padding: ${v('size.padding.xl')};
        gap: ${v('size.padding.md')};
        &::backdrop {
          background-color: rgba(0, 0, 0, 0.1);
        }
      }
      ${c('default-header-text')} {
        font-weight: ${v('font.weight.semibold')};
        font-size: ${v('font.size.xl')};
      }
    `,
  },
});
