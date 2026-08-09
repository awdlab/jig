import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import {
  colorsTemplate,
  controlRing,
  fontTemplate,
  ringTemplate,
  sizesTemplate,
} from '@awdlab/jig-themes/nova/base';
import { calendarControlTemplate } from '@awdlab/jig-themes/templates/calendar';

export const calendarStyles = createThemePart({
  controlTemplate: calendarControlTemplate,
  base: baseStyles.calendar,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate, ringTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c('root')} {
        --icon-size: 14px;
        background: ${v('color.background')};
      }
      ${c('inline')} {
        padding: ${v('size.padding.md')};
        border: 1px solid ${v('color.border')};
        border-radius: ${v('size.rounded.lg')};
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
        border-radius: ${v('size.rounded.md')};
        &:hover {
          background: ${v('color.surface.100')};
        }
        /* The day grid moves focus programmatically, so the ring is on :focus. */
        &:focus {
          outline: 3px solid ${controlRing(v)};
          outline-offset: 0;
        }
        &:active {
          background: ${v('color.surface.300')};
        }
      }
      ${c('day-today')} {
        font-weight: ${v('font.weight.bold')};
        color: ${v('color.primary.600')};
        box-shadow: inset 0 0 0 1px ${v('color.primary.500')};
      }
      ${c('day-other-month')} {
        color: ${v('color.surface.500')};
      }
      ${c('day-selected')} {
        background: ${v('color.primary.500')};
        color: ${v('color.primary.500-contrast')};
        box-shadow: none;
        &${c('day-other-month')} {
          background: ${v('color.primary.300')};
          color: ${v('color.primary.300-contrast')};
        }
        &:not(${c('day-other-month')}):hover,
        &:not(${c('day-other-month')}):focus,
        &:not(${c('day-other-month')}):active {
          background: ${v('color.primary.600')};
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
        width: 3.5rem;
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
