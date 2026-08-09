import { createThemePart, css } from '@awdlab/jig-themes/api';
import { inputControlTemplate } from '@awdlab/jig-themes/templates/input';

export const inputStyles = createThemePart({
  controlTemplate: inputControlTemplate,
  dependencies: [],
  root: {
    css: ({ c, d }) => css`
      ${c('root')} {
        font-family: inherit;
        font-size: inherit;

        &:disabled,
        &:read-only,
        &[aria-readonly] {
          cursor: default;
        }
      }
    `,
  },
});
