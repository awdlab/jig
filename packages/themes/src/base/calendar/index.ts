import { createThemePart, css } from '@ngneers/controls-themes/api';
import { calendarControlTemplate } from '@ngneers/controls-themes/templates/calendar';

export const calendarStyles = createThemePart({
  controlTemplate: calendarControlTemplate,
  dependencies: [],
  root: {
    css: ({ v, c, d }) => css`
      ${c('root')} {
        width: fit-content;
      }
      ${c('input-field')} {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        outline: none;
      }
      ${d('input')} {
        cursor: text;
      }
      ${d('trigger-icon')} {
        cursor: pointer;
      }
      ${c('details')} {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      ${c('header')} {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
      }
      ${c('navigation')} {
        display: flex;
      }
      ${c('days')} {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        justify-items: center;
        align-items: center;
      }
      ${c('months')} {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        justify-items: center;
        align-items: center;
      }
      ${c('week-day')} {
        font-size: inherit;
      }
      ${c('day')} {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: inherit;
      }
      ${d('current-year', 'input', 'root')} {
        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
          display: none; // Chromium and WebKit
        }
        appearance: textfield; // Firefox
      }
    `,
  },
});
