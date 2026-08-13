import { Component } from '@angular/core';
import { JigSkeleton } from '@awdlab/jig/skeleton';

@Component({
  selector: 'jig-demo-skeleton-base',
  imports: [JigSkeleton],
  template: `
    <div class="grid w-96 gap-4">
      <!-- No inputs: full width, one line tall. -->
      <jig-skeleton />
      <div class="flex items-center gap-4">
        <jig-skeleton shape="circle" [diameter]="48" />
        <jig-skeleton [width]="200" [height]="16" />
      </div>
    </div>
  `,
})
export class Demo_Skeleton_Base {}
