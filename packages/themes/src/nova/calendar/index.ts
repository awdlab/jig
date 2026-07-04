import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, sizesTemplate, fontTemplate } from '@ngneers/controls-themes/nova/base';
import { calendarControlTemplate } from '@ngneers/controls-themes/templates/calendar';

export const calendarStyles = createThemePart({
  controlTemplate: calendarControlTemplate,
  base: baseStyles.calendar,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c('root')} {
        --icon-size: 14px;
        background: ${v('color.background')};
      }
      ${c('inline')} {
        padding: ${v('size.padding.md')};
        border: 1px solid ${v('color.surface.300')};
        border-radius: ${v('size.rounded.md')};
      }
      ${c('input-field')} {
        gap: ${v('size.padding.md')};
      }
      ${c('details')} {
        gap: ${v('size.padding.md')};
        min-width: 300px;
      }
      ${c('header')} {
        gap: ${v('size.padding.sm')};
        padding: ${v('size.padding.md')};
        padding-top: 0;
        border-bottom: 1px solid ${v('color.surface.300')};
        justify-content: space-between;
      }
      ${c('navigation')} {
        align-items: center;
        gap: ${v('size.padding.sm')};
      }
      ${c('days')} {
        gap: ${v('size.padding.md')};
        padding-bottom: ${v('size.padding.md')};
      }
      ${c('months')} {
        gap: ${v('size.padding.sm')};
      }
      ${c('week-day')} {
        font-weight: ${v('font.weight.semibold')};
      }
      ${c('day')} {
        cursor: pointer;
        width: 2rem;
        height: 2rem;
        background: transparent;
        border-width: 0;
        border-radius: ${v('size.rounded.full')};
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
        color: ${v('color.surface.800-contrast')};
        &${c('day-other-month')} {
          background: ${v('color.surface.400')};
          color: ${v('color.surface.400-contrast')};
        }
        &:not(${c('day-other-month')}):hover,
        &:not(${c('day-other-month')}):focus,
        &:not(${c('day-other-month')}):active {
          background: ${v('color.surface.800')};
        }
      }
      ${c('current-month')} {
        flex: 1 1 0;
        min-width: 0;
      }
      ${c('current-month')} ${d('select', 'root')} {
        min-width: 0;
      }
      ${c('current-year')} {
        flex: 0 0 auto;
      }
      ${c('current-year')} ${d('select', 'root')} ${d('input', 'root')} {
        width: 3rem;
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
