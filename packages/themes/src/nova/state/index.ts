import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@awdlab/jig-themes/nova/base';
import { stateControlTemplate } from '@awdlab/jig-themes/templates/state';

export const stateStyles = createThemePart({
  controlTemplate: stateControlTemplate,
  base: baseStyles.state,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('kind-cancelled')} {
        color: ${v('color.surface.600')};
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
