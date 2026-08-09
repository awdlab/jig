import { Component } from '@angular/core';
import { NgnCalendar } from '@awdlab/jig/calendar';

import type { NgnPassthrough } from '@awdlab/jig/base';

@Component({
  selector: 'awd-demo-pt-deps',
  imports: [NgnCalendar],
  template: `<awd-calendar [inputId]="'pt-deps'" [inline]="true" [pt]="pt" />`,
})
export class Demo_Pt_Deps {
  protected readonly pt: NgnPassthrough<'calendar'> = {
    // Only the month picker — the year select is left untouched.
    'current-month': {
      root: {
        $classes: 'text-(--awd-color-primary-700) font-(--awd-font-weight-semibold)',
      },
    },
    // The prev / next nav buttons, each addressed by its own slot.
    previous: { root: { $styles: { color: 'var(--awd-color-primary-600)' } } },
    next: { root: { $styles: { color: 'var(--awd-color-primary-600)' } } },
  };
}
