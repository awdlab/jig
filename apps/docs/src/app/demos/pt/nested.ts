import { Component } from '@angular/core';
import { NgnCalendar } from '@ngneers/controls/calendar';

import type { NgnPassthrough } from '@ngneers/controls/base';

/**
 * The calendar composes nested `ngn` controls — the prev/next nav buttons
 * (`ngn-button`) and the month/year pickers (`ngn-select` inside
 * `ngn-input-field`). It flattens their key elements onto its own scope classes,
 * so passthrough reaches them by name: `previous` / `next` for the nav buttons,
 * `current-month` / `current-year` for the select triggers.
 */
@Component({
  selector: 'ngn-demo-pt-nested',
  imports: [NgnCalendar],
  template: `<ngn-calendar [inputId]="'pt-nested'" [inline]="true" [pt]="pt" />`,
})
export class Demo_Pt_Nested {
  protected readonly pt: NgnPassthrough<'calendar'> = {
    // Nested nav buttons
    previous: {
      $styles: {
        borderRadius: '999px',
        background: 'var(--ngn-color-primary-100)',
        color: 'var(--ngn-color-primary-700)',
      },
    },
    next: {
      $styles: {
        borderRadius: '999px',
        background: 'var(--ngn-color-primary-100)',
        color: 'var(--ngn-color-primary-700)',
      },
    },
    // Nested month/year select triggers
    'current-month': {
      $classes: 'font-(--ngn-font-weight-bold)',
      $styles: { color: 'var(--ngn-color-primary-700)' },
    },
    'current-year': {
      $classes: 'font-(--ngn-font-weight-bold)',
      $styles: { color: 'var(--ngn-color-primary-700)' },
    },
  };
}
