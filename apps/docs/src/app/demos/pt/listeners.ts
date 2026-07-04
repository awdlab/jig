import { Component, signal } from '@angular/core';
import { NgnCalendar } from '@ngneers/controls/calendar';

import type { NgnPassthrough } from '@ngneers/controls/base';

/**
 * Attach analytics listeners to the prev/next nav buttons without wrapping the
 * component. The handlers are stable field references, so the engine can detach
 * them cleanly if `pt` ever changes.
 */
@Component({
  selector: 'ngn-demo-pt-listeners',
  imports: [NgnCalendar],
  template: `
    <ngn-calendar [inputId]="'pt-listeners'" [inline]="true" [pt]="pt" />
    <p class="mt-2 text-(length:--ngn-font-size-sm) text-(--ngn-color-surface-600)">
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
