import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { NgnProgress } from '@ngneers/controls/progress';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-demo-progress-indeterminate',
  imports: [NgnProgress],
  template: ` <ngn-progress [value]="value()" indeterminate /> `,
})
export class Demo_Progress_Indeterminate {
  protected readonly value = signal(50);
}
