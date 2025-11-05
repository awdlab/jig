import { createThemePart, css } from '@ngneers/controls-themes/api';
import { accordionControlTemplate } from '@ngneers/controls-themes/templates/accordion';

export const accordionStyles = createThemePart({
  controlTemplate: accordionControlTemplate,
  dependencies: [],
  root: {
    css: ({ v, c }) => css`
      ${c()} {
        display: flex;
        flex-direction: column;
      }
      ${c('panel-content-expander')} {
        /**
        * Nice css trick to animate from auto height to 0 without using (currently not well supported) 'interpolate-size'
        * Source: https://css-tricks.com/css-grid-can-do-auto-height-transitions
        */
        display: grid;
        grid-template-rows: 1fr;
        overflow: hidden;
      }
      ${c('panel-content')} {
        min-height: 0;
        ngn-defer {
          display: block;
        }
      }
      ${c('panel-content-expander-collapsed')} {
        grid-template-rows: 0fr;
      }
      ${c('panel-header')} {
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: space-between;
        user-select: none;
        &:focus-visible {
          outline: none;
        }
      }
    `,
  },
});
