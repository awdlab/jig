import { Component, signal } from '@angular/core';
import { NgnCalendar } from '@awdlab/jig/calendar';

import type { NgnPassthrough } from '@awdlab/jig/base';

@Component({
  selector: 'awd-demo-pt-listeners',
  imports: [NgnCalendar],
  template: `
    <awd-calendar [inputId]="'pt-listeners'" [inline]="true" [pt]="pt" />
    <p class="mt-2 text-(length:--awd-font-size-sm) text-(--awd-color-surface-600)">
      Month changes tracked: {{ navCount() }}
    </p>
  `,
})
export class Demo_Pt_Listeners {
  protected readonly navCount = signal(0);

  private readonly trackNav = () => this.navCount.update(count => count + 1);

  protected readonly pt: NgnPassthrough<'calendar'> = {
    previous: {
      $listeners: { click: this.trackNav },
    },
    next: {
      $listeners: { click: this.trackNav },
    },
  };
}
