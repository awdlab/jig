import { Component } from '@angular/core';
import { AwdProgress } from '@awdlab/jig/progress';

@Component({
  selector: 'jig-demo-progress-circular-indeterminate',
  imports: [AwdProgress],
  template: ` <jig-progress circular indeterminate [radius]="50" [thickness]="6" /> `,
})
export class Demo_Progress_CircularIndeterminate {}
