import { Component } from '@angular/core';
import { JigSkeleton } from '@awdlab/jig/skeleton';

@Component({
  selector: 'jig-demo-skeleton-text',
  imports: [JigSkeleton],
  template: `
    <div class="grid w-96 gap-2">
      <jig-skeleton width="40%" height="1.25rem" />
      <jig-skeleton />
      <jig-skeleton />
      <jig-skeleton />
      <jig-skeleton width="65%" />
    </div>
  `,
})
export class Demo_Skeleton_Text {}
