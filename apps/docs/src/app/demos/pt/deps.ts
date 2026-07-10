import { Component } from '@angular/core';
import { NgnCalendar } from '@ngneers/controls/calendar';

import type { NgnPassthrough } from '@ngneers/controls/base';

@Component({
  selector: 'ngn-demo-pt-deps',
  imports: [NgnCalendar],
  template: `<ngn-calendar [inputId]="'pt-deps'" [inline]="true" [pt]="pt" />`,
})
export class Demo_Pt_Deps {
  protected readonly pt: NgnPassthrough<'calendar'> = {
    // Only the month picker — the year select is left untouched.
    'current-month': {
      root: {
        $classes: 'text-(--ngn-color-primary-700) font-(--ngn-font-weight-semibold)',
      },
    },
    // The prev / next nav buttons, each addressed by its own slot.
    previous: { root: { $styles: { color: 'var(--ngn-color-primary-600)' } } },
    next: { root: { $styles: { color: 'var(--ngn-color-primary-600)' } } },
  };
}
