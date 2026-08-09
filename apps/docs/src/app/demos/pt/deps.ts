import { Component } from '@angular/core';
import { JigCalendar } from '@awdlab/jig/calendar';

import type { JigPassthrough } from '@awdlab/jig/base';

@Component({
  selector: 'jig-demo-pt-deps',
  imports: [JigCalendar],
  template: `<jig-calendar [inputId]="'pt-deps'" [inline]="true" [pt]="pt" />`,
})
export class Demo_Pt_Deps {
  protected readonly pt: JigPassthrough<'calendar'> = {
    // Only the month picker — the year select is left untouched.
    'current-month': {
      root: {
        $classes: 'text-(--jig-color-primary-700) font-(--jig-font-weight-semibold)',
      },
    },
    // The prev / next nav buttons, each addressed by its own slot.
    previous: { root: { $styles: { color: 'var(--jig-color-primary-600)' } } },
    next: { root: { $styles: { color: 'var(--jig-color-primary-600)' } } },
  };
}
