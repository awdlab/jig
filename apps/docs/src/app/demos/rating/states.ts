import { Component, signal } from '@angular/core';
import { NgnRating } from '@ngneers/controls/rating';

@Component({
  selector: 'ngn-demo-rating-states',
  imports: [NgnRating],
  template: `
    <div class="flex flex-col gap-3">
      <ngn-rating [value]="3" [readonly]="true" />
      <ngn-rating [value]="3" [disabled]="true" />
      <ngn-rating
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
