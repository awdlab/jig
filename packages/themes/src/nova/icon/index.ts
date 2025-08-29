import { createThemePart, css } from '@ngneers/controls-themes/api';
import { iconControlTemplate } from '@ngneers/controls-themes/templates/icon';

export const iconStyles = createThemePart({
  controlTemplate: iconControlTemplate,
  dependencies: [],
  root: {
    css: ({ v, c }) => css`
      ${c()} {
        font-size: var(--icon-size);
        width: var(--icon-size);
      }
    `,
  },
});
