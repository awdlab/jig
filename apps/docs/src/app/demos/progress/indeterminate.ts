import { Component, signal } from '@angular/core';
import { NgnProgress } from '@ngneers/controls/progress';

@Component({
  selector: 'ngn-demo-progress-indeterminate',
  imports: [NgnProgress],
  template: ` <ngn-progress [value]="value()" indeterminate /> `,
  host: { class: 'flex-1 max-w-100' },
})
export class Demo_Progress_Indeterminate {
  protected readonly value = signal(50);
}
