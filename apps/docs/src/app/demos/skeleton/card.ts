import { Component } from '@angular/core';
import { JigSkeleton } from '@awdlab/jig/skeleton';

@Component({
  selector: 'jig-demo-skeleton-card',
  imports: [JigSkeleton],
  template: `
    <div
      class="grid w-80 gap-3 rounded-lg border border-[var(--jig-color-surface-300)] p-4"
      role="status"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading article"
    >
      <jig-skeleton [height]="140" [radius]="8" />
      <jig-skeleton width="70%" height="1.5rem" />
      <jig-skeleton />
      <jig-skeleton />
      <jig-skeleton width="45%" />
      <div class="mt-2 flex items-center gap-3">
        <jig-skeleton shape="circle" [diameter]="32" />
        <jig-skeleton width="35%" />
      </div>
    </div>
  `,
})
export class Demo_Skeleton_Card {}
