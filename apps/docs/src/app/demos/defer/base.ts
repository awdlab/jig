import { Component, signal } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';
import { NgnDefer } from '@ngneers/controls/defer';
import { NgnSwitch } from '@ngneers/controls/switch';

let builds = 0;

/** Counts its own constructions, so the deferral is visible. */
@Component({
  selector: 'ngn-demo-defer-panel',
  template: `<div class="panel">Panel constructed {{ build }}× since page load</div>`,
  styles: `
    .panel {
      padding: 16px;
      background: var(--ngn-color-surface-100);
      border-radius: var(--ngn-size-radius-md);
    }
  `,
})
export class DeferDemoPanel {
  protected readonly build = ++builds;
}

@Component({
  selector: 'ngn-demo-defer-base',
  imports: [DeferDemoPanel, NgnButton, NgnDefer, NgnSwitch],
  template: `
    <div class="flex flex-col items-start gap-3">
      <div class="flex items-center gap-4">
        <button ngnButton (click)="open.set(!open())">{{ open() ? 'Hide' : 'Show' }}</button>
        <label [for]="cacheSwitch.inputId()" class="flex items-center gap-2">
          Keep rendered once opened
        </label>
        <ngn-switch #cacheSwitch [(value)]="cache" />
      </div>

      <ngn-defer [open]="open()" [cache]="cache()" [lazyContent]="panel" />

      <ng-template #panel>
        <ngn-demo-defer-panel />
      </ng-template>
    </div>
  `,
})
export class Demo_Defer_Base {
  protected readonly open = signal(false);
  protected readonly cache = signal(false);
}
