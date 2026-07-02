import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, sizesTemplate, fontTemplate } from '@ngneers/controls-themes/shade/base';
import { calendarControlTemplate } from '@ngneers/controls-themes/templates/calendar';

export const calendarStyles = createThemePart({
  controlTemplate: calendarControlTemplate,
  base: baseStyles.calendar,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c('root')} {
        --icon-size: 14px;
        /* Control text baseline (shadcn 0.875rem). Without this the day grid, weekday row and
         * month/year selects inherit the ambient page size (1rem) and read larger than the field
         * that opened the calendar. */
        font-size: ${v('font.size.sm')};
        background: ${v('color.background')};
        color: ${v('color.foreground')};
      }
      ${c('inline')} {
        padding: ${v('size.padding.md')};
        border: 1px solid ${v('color.border')};
        border-radius: ${v('size.rounded.lg')};
      }
      ${c('details')} {
        gap: ${v('size.padding.md')};
        min-width: 300px;
      }
      ${c('header')} {
        gap: ${v('size.padding.sm')};
        padding: ${v('size.padding.md')};
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
        font-weight: ${v('font.weight.medium')};
        color: ${v('color.muted.foreground')};
      }
      ${c('day')} {
        cursor: pointer;
        width: 2rem;
        height: 2rem;
        background: transparent;
        border-width: 0;
        border-radius: ${v('size.rounded.md')};
        &:hover {
          background: ${v('color.accent.base')};
          color: ${v('color.accent.foreground')};
        }
        &:focus {
          background: ${v('color.accent.base')};
          color: ${v('color.accent.foreground')};
        }
      }
      ${c('day-today')}:not(${c('day-selected')}) {
        background: ${v('color.accent.base')};
        color: ${v('color.accent.foreground')};
        font-weight: ${v('font.weight.medium')};
      }
      ${c('day-other-month')} {
        color: ${v('color.muted.foreground')};
      }
      ${c('day-selected')} {
        background: ${v('color.primary.base')};
        color: ${v('color.primary.foreground')};
        &${c('day-other-month')} {
          background: color-mix(in srgb, ${v('color.primary.base')} 60%, transparent);
        }
        &:not(${c('day-other-month')}):hover,
        &:not(${c('day-other-month')}):focus,
        &:not(${c('day-other-month')}):active {
          background: ${v('color.primary.base')};
          color: ${v('color.primary.foreground')};
        }
      }
      ${c('current-month')} {
        width: 100%;
      }
      ${c('current-year')}${d('select', 'root')} ${d('input', 'root')} {
        width: 3rem;
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
