import { Component } from '@angular/core';
import { NgnCalendar } from '@ngneers/controls/calendar';

import type { NgnPassthrough } from '@ngneers/controls/base';

/**
 * A booking UI brands the selected day and enlarges the day cells for touch —
 * all via inline styles pushed into the calendar's internal scope classes.
 */
@Component({
  selector: 'ngn-demo-pt-styles',
  imports: [NgnCalendar],
  template: `<ngn-calendar [inputId]="'pt-styles'" [inline]="true" [pt]="pt" />`,
})
export class Demo_Pt_Styles {
  protected readonly pt: NgnPassthrough<'calendar'> = {
    day: {
      $styles: {
        width: '2.75rem',
        height: '2.75rem',
      },
    },
    'day-selected': {
      $styles: {
        background: 'var(--ngn-color-primary-600)',
        color: 'var(--ngn-color-primary-50)',
        borderRadius: '999px',
        fontWeight: 'var(--ngn-font-weight-bold)',
      },
    },
    'day-today': {
      $styles: {
        outline: '2px solid var(--ngn-color-primary-300)',
        outlineOffset: '-2px',
        borderRadius: '999px',
      },
    },
  };
}
