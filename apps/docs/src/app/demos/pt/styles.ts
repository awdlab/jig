import { Component } from '@angular/core';
import { AwdCalendar } from '@awdlab/jig/calendar';

import type { AwdPassthrough } from '@awdlab/jig/base';

@Component({
  selector: 'jig-demo-pt-styles',
  imports: [AwdCalendar],
  template: `<jig-calendar [inputId]="'pt-styles'" [inline]="true" [pt]="pt" />`,
})
export class Demo_Pt_Styles {
  protected readonly pt: AwdPassthrough<'calendar'> = {
    day: {
      $styles: {
        width: '2.75rem',
        height: '2.75rem',
      },
    },
    'day-selected': {
      $styles: {
        background: 'var(--jig-color-primary-600)',
        color: 'var(--jig-color-primary-50)',
        borderRadius: '999px',
        fontWeight: 'var(--jig-font-weight-bold)',
      },
    },
    'day-today': {
      $styles: {
        outline: '2px solid var(--jig-color-primary-300)',
        outlineOffset: '-2px',
        borderRadius: '999px',
      },
    },
  };
}
