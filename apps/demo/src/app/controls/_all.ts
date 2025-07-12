import { stories as buttonStories } from './button-demo/_all';
import { stories as calendarStories } from './calendar-demo/_all';
import { stories as dialogStories } from './dialog-demo/_all';
import { stories as listBoxStories } from './list-box-demo/_all';
import { stories as popoverStories } from './popover-demo/_all';
import { stories as scrollerStories } from './scroller-demo/_all';
import { stories as selectStories } from './select-demo/_all';
import { stories as splitterStories } from './splitter-demo/_all';
import { stories as textFieldStories } from './text-field-demo/_all';
import { stories as tooltipStories } from './tooltip-demo/_all';

export const allDemos = [
  buttonStories,
  calendarStories,
  dialogStories,
  listBoxStories,
  popoverStories,
  scrollerStories,
  selectStories,
  splitterStories,
  textFieldStories,
  tooltipStories,
] as const;
