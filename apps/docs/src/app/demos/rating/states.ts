import { Component, signal } from '@angular/core';
import { JigRating } from '@awdlab/jig/rating';

@Component({
  selector: 'jig-demo-rating-states',
  imports: [JigRating],
  template: `
    <div class="flex flex-col gap-3">
      <jig-rating [value]="3" [readonly]="true" />
      <jig-rating [value]="3" [disabled]="true" />
      <jig-rating
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
