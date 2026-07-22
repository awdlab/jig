import { Component, signal } from '@angular/core';
import { NgnRating } from '@ngneers/controls/rating';

@Component({
  selector: 'ngn-demo-rating-custom-template',
  imports: [NgnRating],
  template: `
    <ngn-rating [step]="0.5" [value]="value()" (valueChange)="value.set($event)">
      <!-- The template receives the per-symbol fill ratio (0..1), so it can render
           partial fills — here a filled star clipped to the ratio over an empty one,
           which shows half stars when step is 0.5. -->
      <ng-template #indicator let-ratio let-index="index">
        <span style="position: relative; display: inline-block; line-height: 1;">
          <span style="color: #d1d5db;">&#9733;</span>
          <span
            style="position: absolute; inset: 0; overflow: hidden; white-space: nowrap; color: #f59e0b;"
            [style.width.%]="ratio * 100"
            >&#9733;</span
          >
        </span>
      </ng-template>
    </ngn-rating>
    <br />
    {{ value() }}
  `,
})
export class Demo_Rating_CustomTemplate {
  protected readonly value = signal<number | null>(2.5);
}
