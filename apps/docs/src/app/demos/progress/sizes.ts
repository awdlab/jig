import { Component, signal } from '@angular/core';
import { JigProgress } from '@awdlab/jig/progress';

@Component({
  selector: 'jig-demo-progress-sizes',
  imports: [JigProgress],
  template: `
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <jig-progress [value]="value()" circular [radius]="20" [thickness]="4" />
      <jig-progress [value]="value()" circular [radius]="30" [thickness]="5" />
      <jig-progress [value]="value()" circular [radius]="40" [thickness]="6" />
      <jig-progress [value]="value()" circular [radius]="50" [thickness]="8" />
    </div>
  `,
})
export class Demo_Progress_Sizes {
  protected readonly value = signal(60);
}
