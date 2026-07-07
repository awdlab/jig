import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { stateControlTemplate } from '@ngneers/controls-themes/templates/state';

export const stateStyles = createThemePart({
  controlTemplate: stateControlTemplate,
  base: baseStyles.state,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('kind-cancelled')} {
        color: ${v('color.surface.500')};
      }

      ${c('kind-success')} {
        color: ${v('color.success.700')};
      }

      ${c('kind-warning')} {
        color: ${v('color.warning.700')};
      }

      ${c('kind-error')} {
        color: ${v('color.error.700')};
      }
    `,
  },
});
