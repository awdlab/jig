import { Component } from '@angular/core';
import { NgnCalendar } from '@awdlab/jig/calendar';

import type { NgnPassthrough } from '@awdlab/jig/base';

@Component({
  selector: 'awd-demo-pt-classes',
  imports: [NgnCalendar],
  template: `<awd-calendar [inputId]="'pt-classes'" [inline]="true" [pt]="pt" />`,
})
export class Demo_Pt_Classes {
  protected readonly pt: NgnPassthrough<'calendar'> = {
    root: {
      $classes: 'rounded-xl ring-1 ring-(--awd-color-primary-200) overflow-hidden',
    },
    header: {
      $classes: 'rounded-t-lg bg-(--awd-color-surface-100) shadow-sm',
    },
  };
}
