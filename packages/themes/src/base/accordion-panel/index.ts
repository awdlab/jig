import { createThemePart, css } from '@awdlab/jig-themes/api';
import { accordionPanelControlTemplate } from '@awdlab/jig-themes/templates/accordion-panel';

export const accordionPanelStyles = createThemePart({
  controlTemplate: accordionPanelControlTemplate,
  dependencies: [],
  root: {
    css: ({ v, c }) => css`
      ${c('root')} {
        display: flex;
        flex-direction: column;
        width: 100%;
      }
      ${c('content-expander')} {
        /**
        * Nice css trick to animate from auto height to 0 without using (currently not well supported) 'interpolate-size'
        * Source: https://css-tricks.com/css-grid-can-do-auto-height-transitions
        */
        display: grid;
        grid-template-rows: 1fr;
        overflow: hidden;
      }
      ${c('content')} {
        min-height: 0;
        awd-defer {
          display: block;
        }
      }
      ${c('content-expander-collapsed')} {
        grid-template-rows: 0fr;
      }
      ${c('header')} {
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
