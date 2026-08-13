import { Component, signal } from '@angular/core';
import { JigButton } from '@awdlab/jig/button';
import { JigSkeleton } from '@awdlab/jig/skeleton';

@Component({
  selector: 'jig-demo-skeleton-loading',
  imports: [JigSkeleton, JigButton],
  template: `
    <div class="grid w-96 gap-4">
      <button jigButton kind="secondary" (click)="reload()">Reload</button>

      <section
        class="grid gap-2"
        role="status"
        aria-live="polite"
        [attr.aria-busy]="loading()"
        [attr.aria-label]="loading() ? 'Loading release notes' : null"
      >
        <!-- Skeletons sit inside the real elements, so 1lh matches their line height. -->
        <h3 class="text-lg font-semibold">
          @if (loading()) {
            <jig-skeleton width="55%" />
          } @else {
            Release 2.4.0
          }
        </h3>
        <!-- No gap: each skeleton is one 1lh block, stacking exactly like text lines. -->
        <p>
          @if (loading()) {
            <jig-skeleton />
            <jig-skeleton width="70%" />
          } @else {
            Skeleton placeholders now ship with every theme, and each one animates in that theme's
            own style.
          }
        </p>
      </section>
    </div>
  `,
})
export class Demo_Skeleton_Loading {
  protected readonly loading = signal(true);

  constructor() {
    this.reload();
  }

  protected reload() {
    this.loading.set(true);
    setTimeout(() => this.loading.set(false), 2000);
  }
}
