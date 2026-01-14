import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgnProgress } from '@ngneers/controls/progress';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-demo-progress-circular-indeterminate',
  imports: [NgnProgress],
  template: ` <ngn-progress circular indeterminate [radius]="50" [thickness]="6" /> `,
})
export class Demo_Progress_CircularIndeterminate {}
