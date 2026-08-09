import { Component, signal } from '@angular/core';
import { NgnProgress } from '@awdlab/jig/progress';

@Component({
  selector: 'awd-demo-progress-sizes',
  imports: [NgnProgress],
  template: `
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <awd-progress [value]="value()" circular [radius]="20" [thickness]="4" />
      <awd-progress [value]="value()" circular [radius]="30" [thickness]="5" />
      <awd-progress [value]="value()" circular [radius]="40" [thickness]="6" />
      <awd-progress [value]="value()" circular [radius]="50" [thickness]="8" />
    </div>
  `,
})
export class Demo_Progress_Sizes {
  protected readonly value = signal(60);
}
