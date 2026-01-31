import { createThemePart, css } from '@ngneers/controls-themes/api';
import { inputMaskControlTemplate } from '@ngneers/controls-themes/templates/input-mask';

export const inputMaskStyles = createThemePart({
  controlTemplate: inputMaskControlTemplate,
  dependencies: [],
  root: {
    css: ({ v, c }) => css`
      ${c('root')} {
        position: relative;
      }
      ${c('mask')} {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
      }
      ${c('mask-placeholder')} {
        opacity: 0;
      }
    `,
  },
});
