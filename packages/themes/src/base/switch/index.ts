import { createThemePart, css } from '@awdlab/jig-themes/api';
import { switchControlTemplate } from '@awdlab/jig-themes/templates/switch';

export const switchStyles = createThemePart({
  controlTemplate: switchControlTemplate,
  dependencies: [],
  root: {
    css: ({ v, c, d }) => css`
      ${c('root')} {
        display: inline-flex;
        user-select: none;
        align-items: center;
        position: relative;
        vertical-align: middle;
        width: min-content;
        min-width: min-content;
        flex-shrink: 0;
      }
      ${c('input')} {
        position: absolute;
        opacity: 0;
        inset: 0;
        margin: 0;
      }
      ${c('track')} {
        display: flex;
        align-items: center;
      }
    `,
  },
});
