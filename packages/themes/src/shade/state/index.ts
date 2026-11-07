import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@awdlab/jig-themes/shade/base';
import { stateControlTemplate } from '@awdlab/jig-themes/templates/state';

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
        color: ${v('color.success')};
      }

      ${c('kind-warning')} {
        color: ${v('color.warning')};
      }

      ${c('kind-error')} {
        color: ${v('color.destructive.base')};
      }
    `,
  },
});
