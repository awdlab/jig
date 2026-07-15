import { NgnDocsCalendarPlayground } from './playground';
import { Demo_Calendar_Base } from '../../../demos/calendar/base';
import { Demo_Calendar_Inline } from '../../../demos/calendar/inline';
import { Demo_Calendar_InlineTime } from '../../../demos/calendar/inline-time';
import { Demo_Calendar_States } from '../../../demos/calendar/states';
import { Demo_Calendar_Time } from '../../../demos/calendar/time';
import { Demo_Calendar_Validation } from '../../../demos/calendar/validation';
import { i18nKeys } from '../../../utils/i18n-doc';

import type { NgnDocsPage } from '../../../utils/page/types';

export const CalendarPage: NgnDocsPage = {
  title: `Calendar`,
  kind: 'tabs',
  tabs: [
    {
      kind: 'single',
      default: true,

      title: 'Examples',
      mdFile: 'components/calendar/index.md',
      components: [
        Demo_Calendar_Base,
        Demo_Calendar_Validation,
        Demo_Calendar_States,
        Demo_Calendar_Inline,
        Demo_Calendar_Time,
        Demo_Calendar_InlineTime,
      ],
    },
    {
      kind: 'component',
      title: 'Playground',
      component: NgnDocsCalendarPlayground,
    },
    { kind: 'single', title: 'API', mdFile: 'components/calendar/api.md' },
    { kind: 'single', title: 'A11y', mdFile: 'components/calendar/a11y.md' },
    i18nKeys(
      'calendar',
      {
        today: 'Label for the control that jumps the view back to the current date.',
        input: 'Accessible label for the masked date input field.',
        selectYear: 'Accessible label for the year selection control.',
        selectMonth: 'Accessible label for the month selection control.',
        previousMonth: 'Accessible label for the button that navigates to the previous month.',
        nextMonth: 'Accessible label for the button that navigates to the next month.',
        weekdays: {
          monday: 'Full name of the weekday, shown in the calendar grid header.',
          tuesday: 'Full name of the weekday, shown in the calendar grid header.',
          wednesday: 'Full name of the weekday, shown in the calendar grid header.',
          thursday: 'Full name of the weekday, shown in the calendar grid header.',
          friday: 'Full name of the weekday, shown in the calendar grid header.',
          saturday: 'Full name of the weekday, shown in the calendar grid header.',
          sunday: 'Full name of the weekday, shown in the calendar grid header.',
        },
        weekdaysShort: {
          monday: 'Abbreviated weekday name shown in the day-of-week header row.',
          tuesday: 'Abbreviated weekday name shown in the day-of-week header row.',
          wednesday: 'Abbreviated weekday name shown in the day-of-week header row.',
          thursday: 'Abbreviated weekday name shown in the day-of-week header row.',
          friday: 'Abbreviated weekday name shown in the day-of-week header row.',
          saturday: 'Abbreviated weekday name shown in the day-of-week header row.',
          sunday: 'Abbreviated weekday name shown in the day-of-week header row.',
        },
        months: {
          january: 'Full month name shown in the month picker and calendar header.',
          february: 'Full month name shown in the month picker and calendar header.',
          march: 'Full month name shown in the month picker and calendar header.',
          april: 'Full month name shown in the month picker and calendar header.',
          may: 'Full month name shown in the month picker and calendar header.',
          june: 'Full month name shown in the month picker and calendar header.',
          july: 'Full month name shown in the month picker and calendar header.',
          august: 'Full month name shown in the month picker and calendar header.',
          september: 'Full month name shown in the month picker and calendar header.',
          october: 'Full month name shown in the month picker and calendar header.',
          november: 'Full month name shown in the month picker and calendar header.',
          december: 'Full month name shown in the month picker and calendar header.',
        },
      },
      ['mask-input']
    ),
  ],
};
