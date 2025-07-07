import {
  buildVariationCombinationStyles,
  combineVariableVariations,
  createThemePart,
  createVariableTemplate,
  css,
  repeatVariables,
} from '@ngneers/controls-themes/api';
import { colorsTemplate, sizesTemplate, fontTemplate } from '@ngneers/controls-themes/nova/base';
import { calendarControlTemplate } from '@ngneers/controls-themes/templates/calendar';
import { subKey } from 'packages/themes/src/api/utils/sub-key';

const dayKinds = ['', 'today', 'other-month', 'selected'] as const;
const dayStates = ['', 'hover', 'focus', 'active', 'disabled'] as const;

export const calendarVariables = createVariableTemplate({
  scope: 'calendar',
  variables: {
    borderRadius: null,
    padding: null,
    boxShadow: null,
    transition: null,
    days: {
      gap: null,
    },
    months: {
      gap: null,
    },
    weekDay: {
      color: null,
      fontSize: null,
      fontWeight: null,
    },
    day: {
      ...repeatVariables(combineVariableVariations(dayKinds, dayStates), {
        color: null,
        fontSize: null,
        fontWeight: null,
        background: null,
        borderColor: null,
        borderStyle: null,
        borderWidth: null,
        borderRadius: null,
        size: null,
        cursor: null,
      }),
    },
  },
});

export const calendarStyles = createThemePart({
  controlTemplate: calendarControlTemplate,
  variables: [calendarVariables],
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    values: {
      borderRadius: '{size.rounded.md}',
      padding: '{size.padding.sm}',
      boxShadow: '{shadow.sm}',
      days: {
        gap: '0.25rem',
      },
      months: {
        gap: '0.25rem',
      },
      weekDay: {
        fontWeight: '{font.weight.semibold}',
      },
      day: {
        background: 'transparent',
        borderWidth: '0',
        borderRadius: '{size.rounded.full}',
        size: '2rem',
        cursor: 'pointer',
        hover: {
          background: '{color.surface.100}',
        },
        focus: {
          background: '{color.surface.200}',
        },
        active: {
          background: '{color.surface.300}',
        },
        selected: {
          background: '{color.surface.800}',
          color: '{color.surface.50}',
        },
        today: {
          fontWeight: '{font.weight.bold}',
          hover: {
            background: '{color.surface.100}',
          },
          focus: {
            background: '{color.surface.200}',
          },
          active: {
            background: '{color.surface.300}',
          },
        },
        'other-month': {
          color: '{color.surface.400}',
          hover: {
            background: '{color.surface.100}',
          },
          focus: {
            background: '{color.surface.200}',
          },
          active: {
            background: '{color.surface.300}',
          },
        },
      },
    },
    css: ({ v, c, d }) =>
      css`
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
          gap: ${v('calendar.days.gap')};
        }
        ${c('months')} {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          justify-items: center;
          align-items: center;
          gap: ${v('calendar.months.gap')};
        }
        ${c('week-day')} {
          color: ${v('calendar.weekDay.color')};
          font-size: ${v('calendar.weekDay.fontSize')};
          font-weight: ${v('calendar.weekDay.fontWeight')};
        }
        ${c('day')} {
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          width: ${v('calendar.day.size')};
          height: ${v('calendar.day.size')};
        }
      ` +
      // TODO: That function name is nasty :D
      buildVariationCombinationStyles(
        [dayKinds, dayStates],
        (variation, state) => css`
          ${c(variation ? `day-${variation}` : 'day')}${state ? `:${state}` : ''} {
            background: ${v(subKey('calendar', 'day', variation, state, 'background'))};
            color: ${v(subKey('calendar', 'day', variation, state, 'color'))};
            border-color: ${v(subKey('calendar', 'day', variation, state, 'borderColor'))};
            border-radius: ${v(subKey('calendar', 'day', variation, state, 'borderRadius'))};
            border-style: ${v(subKey('calendar', 'day', variation, state, 'borderStyle'))};
            font-size: ${v(subKey('calendar', 'day', variation, state, 'fontSize'))};
            font-weight: ${v(subKey('calendar', 'day', variation, state, 'fontWeight'))};
          }
        `
      ),
  },
});
