import { createThemePart, css } from '@awdlab/jig-themes/api';
import { otpControlTemplate } from '@awdlab/jig-themes/templates/otp';

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
