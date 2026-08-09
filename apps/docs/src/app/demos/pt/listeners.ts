import { Component, signal } from '@angular/core';
import { JigCalendar } from '@awdlab/jig/calendar';

import type { JigPassthrough } from '@awdlab/jig/base';

@Component({
  selector: 'jig-demo-pt-listeners',
  imports: [JigCalendar],
  template: `
    <jig-calendar [inputId]="'pt-listeners'" [inline]="true" [pt]="pt" />
    <p class="mt-2 text-(length:--jig-font-size-sm) text-(--jig-color-surface-600)">
      Month changes tracked: {{ navCount() }}
    </p>
  `,
})
export class Demo_Pt_Listeners {
  protected readonly navCount = signal(0);

  private readonly trackNav = () => this.navCount.update(count => count + 1);

  protected readonly pt: JigPassthrough<'calendar'> = {
    previous: {
      $listeners: { click: this.trackNav },
    },
    next: {
      $listeners: { click: this.trackNav },
    },
  };
}
