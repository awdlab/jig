import { Component } from '@angular/core';
import { NgnCalendar } from '@awdlab/jig/calendar';

import type { NgnPassthrough } from '@awdlab/jig/base';

@Component({
  selector: 'awd-demo-pt-attributes',
  imports: [NgnCalendar],
  template: `<awd-calendar [inputId]="'pt-attributes'" [inline]="true" [pt]="pt" />`,
})
export class Demo_Pt_Attributes {
  protected readonly pt: NgnPassthrough<'calendar'> = {
    root: {
      $attributes: {
        'data-testid': 'booking-calendar',
      },
    },
    'day-today': {
      $attributes: {
        'data-today': 'true',
        'aria-current': 'date',
      },
    },
  };
}
