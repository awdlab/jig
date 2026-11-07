import { Component } from '@angular/core';
import { JigCalendar } from '@awdlab/jig/calendar';

import type { JigPassthrough } from '@awdlab/jig/base';

@Component({
  selector: 'jig-demo-pt-classes',
  imports: [JigCalendar],
  template: `<jig-calendar [inputId]="'pt-classes'" [inline]="true" [pt]="pt" />`,
})
export class Demo_Pt_Classes {
  protected readonly pt: JigPassthrough<'calendar'> = {
    root: {
      $classes: 'rounded-xl ring-1 ring-(--jig-color-primary-200) overflow-hidden',
    },
    header: {
      $classes: 'rounded-t-lg bg-(--jig-color-surface-100) shadow-sm',
    },
  };
}
