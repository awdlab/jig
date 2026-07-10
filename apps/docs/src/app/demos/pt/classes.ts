import { Component } from '@angular/core';
import { NgnCalendar } from '@ngneers/controls/calendar';

import type { NgnPassthrough } from '@ngneers/controls/base';

@Component({
  selector: 'ngn-demo-pt-classes',
  imports: [NgnCalendar],
  template: `<ngn-calendar [inputId]="'pt-classes'" [inline]="true" [pt]="pt" />`,
})
export class Demo_Pt_Classes {
  protected readonly pt: NgnPassthrough<'calendar'> = {
    root: {
      $classes: 'rounded-xl ring-1 ring-(--ngn-color-primary-200) overflow-hidden',
    },
    header: {
      $classes: 'rounded-t-lg bg-(--ngn-color-surface-100) shadow-sm',
    },
  };
}
