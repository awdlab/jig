import { Component, signal } from '@angular/core';
import { JigProgress } from '@awdlab/jig/progress';

@Component({
  selector: 'jig-demo-progress-indeterminate',
  imports: [JigProgress],
  template: ` <jig-progress [value]="value()" indeterminate /> `,
  host: { class: 'flex-1 max-w-100' },
})
export class Demo_Progress_Indeterminate {
  protected readonly value = signal(50);
}
