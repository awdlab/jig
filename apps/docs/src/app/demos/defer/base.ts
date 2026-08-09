import { Component, signal } from '@angular/core';
import { AwdButton } from '@awdlab/jig/button';
import { AwdDefer } from '@awdlab/jig/defer';
import { AwdSwitch } from '@awdlab/jig/switch';

let builds = 0;

/** Counts its own constructions, so the deferral is visible. */
@Component({
  selector: 'jig-demo-defer-panel',
  template: `<div class="panel">Panel constructed {{ build }}× since page load</div>`,
  styles: `
    .panel {
      padding: 16px;
      background: var(--jig-color-surface-100);
      border-radius: var(--jig-size-radius-md);
    }
  `,
})
export class DeferDemoPanel {
  protected readonly build = ++builds;
}

@Component({
  selector: 'jig-demo-defer-base',
  imports: [DeferDemoPanel, AwdButton, AwdDefer, AwdSwitch],
  template: `
    <div class="flex flex-col items-start gap-3">
      <div class="flex items-center gap-4">
        <button ngnButton (click)="open.set(!open())">{{ open() ? 'Hide' : 'Show' }}</button>
        <label [for]="cacheSwitch.inputId()" class="flex items-center gap-2">
          Keep rendered once opened
        </label>
        <jig-switch #cacheSwitch [(value)]="cache" />
      </div>

      <jig-defer [open]="open()" [cache]="cache()" [lazyContent]="panel" />

      <ng-template #panel>
        <jig-demo-defer-panel />
      </ng-template>
    </div>
  `,
})
export class Demo_Defer_Base {
  protected readonly open = signal(false);
  protected readonly cache = signal(false);
}
