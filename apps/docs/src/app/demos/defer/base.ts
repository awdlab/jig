import { Component, signal } from '@angular/core';
import { NgnButton } from '@awdlab/jig/button';
import { NgnDefer } from '@awdlab/jig/defer';
import { NgnSwitch } from '@awdlab/jig/switch';

let builds = 0;

/** Counts its own constructions, so the deferral is visible. */
@Component({
  selector: 'awd-demo-defer-panel',
  template: `<div class="panel">Panel constructed {{ build }}× since page load</div>`,
  styles: `
    .panel {
      padding: 16px;
      background: var(--awd-color-surface-100);
      border-radius: var(--awd-size-radius-md);
    }
  `,
})
export class DeferDemoPanel {
  protected readonly build = ++builds;
}

@Component({
  selector: 'awd-demo-defer-base',
  imports: [DeferDemoPanel, NgnButton, NgnDefer, NgnSwitch],
  template: `
    <div class="flex flex-col items-start gap-3">
      <div class="flex items-center gap-4">
        <button ngnButton (click)="open.set(!open())">{{ open() ? 'Hide' : 'Show' }}</button>
        <label [for]="cacheSwitch.inputId()" class="flex items-center gap-2">
          Keep rendered once opened
        </label>
        <awd-switch #cacheSwitch [(value)]="cache" />
      </div>

      <awd-defer [open]="open()" [cache]="cache()" [lazyContent]="panel" />

      <ng-template #panel>
        <awd-demo-defer-panel />
      </ng-template>
    </div>
  `,
})
export class Demo_Defer_Base {
  protected readonly open = signal(false);
  protected readonly cache = signal(false);
}
