import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { colorsTemplate, sizesTemplate, fontTemplate } from '@awdlab/jig-themes/material/base';
import { calendarControlTemplate } from '@awdlab/jig-themes/templates/calendar';

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
        border: 1px solid ${v('color.border')};
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
        border-bottom: 1px solid ${v('color.border')};
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
          background: color-mix(in srgb, ${v('color.text')} 8%, transparent);
        }
        &:focus {
          background: color-mix(in srgb, ${v('color.text')} 12%, transparent);
        }
        &:active {
          background: color-mix(in srgb, ${v('color.text')} 12%, transparent);
        }
      }
      ${c('day-today')} {
        font-weight: ${v('font.weight.bold')};
        border: 1px solid ${v('color.primary.foreground')};
      }
      ${c('day-other-month')} {
        color: ${v('color.surface.400')};
      }
      ${c('day-selected')} {
        background: ${v('color.primary.500')};
        color: ${v('color.primary.500-contrast')};
        &${c('day-other-month')} {
          background: ${v('color.surface.400')};
          color: ${v('color.surface.400-contrast')};
        }
        &:not(${c('day-other-month')}):hover,
        &:not(${c('day-other-month')}):focus,
        &:not(${c('day-other-month')}):active {
          background: color-mix(
            in srgb,
            ${v('color.primary.500')} 88%,
            ${v('color.primary.500-contrast')}
          );
        }
      }
      ${d('current-month-field')} {
        flex: 1 1 0;
        min-width: 0;
      }
      ${d('current-month')} {
        min-width: 0;
      }
      ${d('current-year-field')} {
        flex: 0 0 auto;
      }
      ${d('current-year-field')} ${d('current-year', 'input', 'root')} {
        width: 3rem;
        min-width: 0;
      }
      ${c('time')} {
        border-top: 1px solid ${v('color.border')};
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
