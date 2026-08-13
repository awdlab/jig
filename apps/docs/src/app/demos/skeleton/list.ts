import { Component } from '@angular/core';
import { JigSkeleton } from '@awdlab/jig/skeleton';

@Component({
  selector: 'jig-demo-skeleton-list',
  imports: [JigSkeleton],
  template: `
    <ul
      class="grid w-96 gap-4"
      role="status"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading contacts"
    >
      @for (row of rows; track $index) {
        <li class="flex items-center gap-3">
          <jig-skeleton shape="circle" [diameter]="40" />
          <div class="grid flex-1 gap-2">
            <jig-skeleton [width]="row" />
            <jig-skeleton width="30%" height="0.75rem" />
          </div>
          <jig-skeleton [width]="64" [height]="28" [radius]="6" />
        </li>
      }
    </ul>
  `,
})
export class Demo_Skeleton_List {
  protected readonly rows = ['55%', '70%', '45%', '62%'];
}
