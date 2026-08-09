import { createThemePart, css } from '@awdlab/jig-themes/api';
import { radioControlTemplate } from '@awdlab/jig-themes/templates/radio';

export const radioStyles = createThemePart({
  controlTemplate: radioControlTemplate,
  dependencies: [],
  root: {
    css: ({ c }) => css`
      ${c('root')} {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        position: relative;
        cursor: pointer;
        user-select: none;
        vertical-align: middle;
        outline: none;
      }
      ${c('root')}[aria-disabled='true'] {
        cursor: default;
      }
      ${c('circle')} {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        flex: none;
        position: relative;
      }
      ${c('dot')} {
        border-radius: 9999px;
      }
    `,
  },
});
