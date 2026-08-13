import { Component } from '@angular/core';
import { JigSkeleton } from '@awdlab/jig/skeleton';

@Component({
  selector: 'jig-demo-skeleton-shapes',
  imports: [JigSkeleton],
  template: `
    <div class="flex w-140 flex-wrap items-end gap-6">
      <jig-skeleton shape="circle" [diameter]="24" />
      <jig-skeleton shape="circle" [diameter]="40" />
      <jig-skeleton shape="circle" [diameter]="64" />
      <jig-skeleton [width]="96" [height]="64" [radius]="0" />
      <jig-skeleton [width]="96" [height]="64" [radius]="12" />
      <jig-skeleton [width]="96" [height]="64" radius="9999px" />
    </div>
  `,
})
export class Demo_Skeleton_Shapes {}
