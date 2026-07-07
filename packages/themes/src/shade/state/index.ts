import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@ngneers/controls-themes/shade/base';
import { stateControlTemplate } from '@ngneers/controls-themes/templates/state';

export const stateStyles = createThemePart({
  controlTemplate: stateControlTemplate,
  base: baseStyles.state,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('kind-cancelled')} {
        color: ${v('color.muted.foreground')};
      }

      ${c('kind-success')} {
        color: #16a34a;
      }

      ${c('kind-warning')} {
        color: #d97706;
      }

      ${c('kind-error')} {
        color: ${v('color.destructive.base')};
      }
    `,
  },
});
