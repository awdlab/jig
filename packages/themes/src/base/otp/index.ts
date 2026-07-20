import { createThemePart, css } from '@ngneers/controls-themes/api';
import { otpControlTemplate } from '@ngneers/controls-themes/templates/otp';

export const otpStyles = createThemePart({
  controlTemplate: otpControlTemplate,
  dependencies: [],
  root: {
    css: ({ c }) => css`
      ${c('root')} {
        display: inline-flex;
        align-items: center;
      }
      ${c('box')} {
        box-sizing: border-box;
        text-align: center;
        font-family: inherit;
        appearance: none;

        &:disabled,
        &:read-only {
          cursor: default;
        }
      }
    `,
  },
});
