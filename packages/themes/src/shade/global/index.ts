import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { fontTemplate } from '@awdlab/jig-themes/shade/base';
import { globalControlTemplate } from '@awdlab/jig-themes/templates/global';

export const globalStyles = createThemePart({
  controlTemplate: globalControlTemplate,
  base: baseStyles.global,
  dependencies: [fontTemplate],
  root: {
    css: ({ v }) => css`
      /* The doubled class outranks the base parts' font-family: inherit on native hosts. */
      .jig-control.jig-control:not(.jig-unstyled) {
        font-family: ${v('font.family')};
      }
    `,
  },
});
