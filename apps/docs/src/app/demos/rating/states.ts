import { Component, signal } from '@angular/core';
import { NgnRating } from '@awdlab/jig/rating';

@Component({
  selector: 'awd-demo-rating-states',
  imports: [NgnRating],
  template: `
    <div class="flex flex-col gap-3">
      <awd-rating [value]="3" [readonly]="true" />
      <awd-rating [value]="3" [disabled]="true" />
      <awd-rating
        [value]="value()"
        [invalid]="(value() ?? 0) < 3"
        [invalidOn]="'immediate'"
        (valueChange)="value.set($event)"
      />
    </div>
  `,
})
export class Demo_Rating_States {
  protected readonly value = signal<number | null>(2);
}
