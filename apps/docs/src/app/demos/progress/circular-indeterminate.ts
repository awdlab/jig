import { Component } from '@angular/core';
import { NgnProgress } from '@awdlab/jig/progress';

@Component({
  selector: 'awd-demo-progress-circular-indeterminate',
  imports: [NgnProgress],
  template: ` <awd-progress circular indeterminate [radius]="50" [thickness]="6" /> `,
})
export class Demo_Progress_CircularIndeterminate {}
