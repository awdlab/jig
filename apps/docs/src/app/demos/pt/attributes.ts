import { Component } from '@angular/core';
import { AwdCalendar } from '@awdlab/jig/calendar';

import type { AwdPassthrough } from '@awdlab/jig/base';

@Component({
  selector: 'jig-demo-pt-attributes',
  imports: [AwdCalendar],
  template: `<jig-calendar [inputId]="'pt-attributes'" [inline]="true" [pt]="pt" />`,
})
export class Demo_Pt_Attributes {
  protected readonly pt: AwdPassthrough<'calendar'> = {
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
