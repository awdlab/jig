import { Component, signal } from '@angular/core';
import { NgnProgress } from '@awdlab/jig/progress';

@Component({
  selector: 'awd-demo-progress-indeterminate',
  imports: [NgnProgress],
  template: ` <awd-progress [value]="value()" indeterminate /> `,
  host: { class: 'flex-1 max-w-100' },
})
export class Demo_Progress_Indeterminate {
  protected readonly value = signal(50);
}
