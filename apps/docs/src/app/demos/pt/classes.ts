import { Component } from '@angular/core';
import { AwdCalendar } from '@awdlab/jig/calendar';

import type { AwdPassthrough } from '@awdlab/jig/base';

@Component({
  selector: 'jig-demo-pt-classes',
  imports: [AwdCalendar],
  template: `<jig-calendar [inputId]="'pt-classes'" [inline]="true" [pt]="pt" />`,
})
export class Demo_Pt_Classes {
  protected readonly pt: AwdPassthrough<'calendar'> = {
    root: {
      $classes: 'rounded-xl ring-1 ring-(--jig-color-primary-200) overflow-hidden',
    },
    header: {
      $classes: 'rounded-t-lg bg-(--jig-color-surface-100) shadow-sm',
    },
  };
}
