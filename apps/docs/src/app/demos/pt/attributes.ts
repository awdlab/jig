import { Component } from '@angular/core';
import { NgnCalendar } from '@ngneers/controls/calendar';

import type { NgnPassthrough } from '@ngneers/controls/base';

/**
 * Static attribute hooks: a `data-testid` for e2e selectors on the root, plus
 * `data-*` / `aria-*` markers on the today cell for analytics and assistive tech.
 */
@Component({
  selector: 'ngn-demo-pt-attributes',
  imports: [NgnCalendar],
  template: `<ngn-calendar [inputId]="'pt-attributes'" [inline]="true" [pt]="pt" />`,
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
