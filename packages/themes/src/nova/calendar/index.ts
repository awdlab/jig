import { createThemePart, css } from '@ngneers/controls-themes/api';
import { colorsTemplate, sizesTemplate, fontTemplate } from '@ngneers/controls-themes/nova/base';
import { calendarControlTemplate } from '@ngneers/controls-themes/templates/calendar';

export const calendarStyles = createThemePart({
  controlTemplate: calendarControlTemplate,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c()} {
        width: fit-content;
        --icon-size: 14px;
      }
      ${c('inline')} {
        padding: ${v('size.padding.md')};
        border: 1px solid ${v('color.surface.300')};
        border-radius: ${v('size.rounded.md')};
      }
      ${c('input-field')} ${d('input-field')} {
        display: flex;
      }
      ${c('input')} {
        cursor: text;
        appearance: textfield; // Hide the calendar icon in Firefox
      }
      ${c('input')}::-webkit-calendar-picker-indicator {
        display: none; // Hide the calendar icon in WebKit browsers
      }
      ${c('input')} ${d('input-field')} {
        display: flex;
      }
      ${c('details')} {
        display: flex;
        gap: ${v('size.padding.md')};
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      ${c('header')} {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: ${v('size.padding.sm')};
        padding: ${v('size.padding.md')};
        padding-top: 0;
        width: 100%;
        border-bottom: 1px solid ${v('color.surface.300')};
      }
      ${c('navigation')} {
        display: flex;
        align-items: center;
      }
      ${c('days')} {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        justify-items: center;
        align-items: center;
        gap: ${v('size.padding.md')};
      }
      ${c('months')} {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        justify-items: center;
        align-items: center;
        gap: ${v('size.padding.sm')};
      }
      ${c('week-day')} {
        font-weight: ${v('font.weight.semibold')};
        font-size: inherit;
      }
      ${c('day')} {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        width: 2rem;
        height: 2rem;
        background: transparent;
        border-width: 0;
        border-radius: ${v('size.rounded.full')};
        font-size: inherit;
        &:hover {
          background: ${v('color.surface.100')};
        }
        &:focus {
          background: ${v('color.surface.200')};
        }
        &:active {
          background: ${v('color.surface.300')};
        }
      }
      ${c('day-today')} {
        font-weight: ${v('font.weight.bold')};
      }
      ${c('day-other-month')} {
        color: ${v('color.surface.400')};
      }
      ${c('day-selected')} {
        background: ${v('color.surface.800')};
        color: ${v('color.surface.50')};
        &${c('day-other-month')} {
          background: ${v('color.surface.400')};
        }
        &:not(${c('day-other-month')}):hover,
        &:not(${c('day-other-month')}):focus,
        &:not(${c('day-other-month')}):active {
          background: ${v('color.surface.800')};
        }
      }
      ${c('current-year')}${d('select')} ${d('input')} {
        width: 3rem;
        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
          display: none; // Chromium and WebKit
        }
        appearance: textfield; // Firefox
      }
      ${c('time')} {
        border-top: 1px solid ${v('color.surface.300')};
        width: 100%;
        padding-top: ${v('size.padding.md')};
        display: flex;
        justify-content: center;
        > * {
          width: 120px;
          display: block;
        }
      }
    `,
  },
});
