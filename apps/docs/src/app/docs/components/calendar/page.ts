import { NgnDocsCalendarPlayground } from './playground';
import { Demo_Calendar_Base } from '../../../demos/calendar/base';
import { Demo_Calendar_Inline } from '../../../demos/calendar/inline';
import { Demo_Calendar_InlineTime } from '../../../demos/calendar/inline-time';
import { Demo_Calendar_Time } from '../../../demos/calendar/time';
import { NgnDocsPage } from '../../../utils/page/types';

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
  ],
};
