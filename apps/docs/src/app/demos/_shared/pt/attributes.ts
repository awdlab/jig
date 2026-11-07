import { Component } from '@angular/core';
import { JigCalendar } from '@awdlab/jig/calendar';

import type { JigPassthrough } from '@awdlab/jig/base';

@Component({
  selector: 'jig-demo-pt-attributes',
  imports: [JigCalendar],
  template: `<jig-calendar [inputId]="'pt-attributes'" [inline]="true" [pt]="pt" />`,
})
export class Demo_Pt_Attributes {
  protected readonly pt: JigPassthrough<'calendar'> = {
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
