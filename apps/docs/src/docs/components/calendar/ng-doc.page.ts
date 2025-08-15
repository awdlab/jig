import { NgDocPage } from '@ng-doc/core';
import { NgnCalendar } from '@ngneers/controls/calendar';

import { Demo_Calendar_Base } from '../../../app/demos/calendar/base';
import ComponentsCategory from '../../categories/components/ng-doc.category';

const CalendarPage: NgDocPage = {
  title: `Calendar`,
  mdFile: ['./index.md', './api.md', './playground.md'],
  category: ComponentsCategory,
  demos: {
    Demo_Calendar_Base,
  },
  playgrounds: {
    CalendarPlayground: {
      target: NgnCalendar,
      template: `<ng-doc-selector></ng-doc-selector>`,
    },
  },
};

export default CalendarPage;
