import { createThemePart, createVariableTemplate, css } from '@ngneers/controls-themes/api';
import { colorsTemplate, sizesTemplate, fontTemplate } from '@ngneers/controls-themes/nova/base';
import { calendarControlTemplate } from '@ngneers/controls-themes/templates/calendar';

export const calendarVariables = createVariableTemplate({
  scope: 'calendar',
  variables: {},
});

export const calendarStyles = createThemePart({
  controlTemplate: calendarControlTemplate,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c()} {
        width: fit-content;
      }
      ${c('details')} {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      ${c('days')} {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        justify-items: center;
        align-items: center;
        gap: ${v('size.padding.sm')};
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
        &:hover,
        &:focus,
        &:active {
          background: ${v('color.surface.800')};
        }
      }
    `,
  },
});
