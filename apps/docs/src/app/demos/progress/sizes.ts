import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { NgnProgress } from '@ngneers/controls/progress';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-demo-progress-sizes',
  imports: [NgnProgress],
  template: `
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <ngn-progress [value]="value()" circular [radius]="20" [thickness]="4" />
      <ngn-progress [value]="value()" circular [radius]="30" [thickness]="5" />
      <ngn-progress [value]="value()" circular [radius]="40" [thickness]="6" />
      <ngn-progress [value]="value()" circular [radius]="50" [thickness]="8" />
    </div>
  `,
})
export class Demo_Progress_Sizes {
  protected readonly value = signal(60);
}
