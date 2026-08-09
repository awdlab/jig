import { Component } from '@angular/core';
import { NgnCalendar } from '@awdlab/jig/calendar';

import type { NgnPassthrough } from '@awdlab/jig/base';

@Component({
  selector: 'awd-demo-pt-styles',
  imports: [NgnCalendar],
  template: `<awd-calendar [inputId]="'pt-styles'" [inline]="true" [pt]="pt" />`,
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
        background: 'var(--awd-color-primary-600)',
        color: 'var(--awd-color-primary-50)',
        borderRadius: '999px',
        fontWeight: 'var(--awd-font-weight-bold)',
      },
    },
    'day-today': {
      $styles: {
        outline: '2px solid var(--awd-color-primary-300)',
        outlineOffset: '-2px',
        borderRadius: '999px',
      },
    },
  };
}
