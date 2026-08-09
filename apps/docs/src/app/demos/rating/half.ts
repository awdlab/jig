import { Component, signal } from '@angular/core';
import { AwdRating } from '@awdlab/jig/rating';

@Component({
  selector: 'jig-demo-rating-half',
  imports: [AwdRating],
  template: `<jig-rating [step]="0.5" [value]="value()" (valueChange)="value.set($event)" />`,
})
export class Demo_Rating_Half {
  protected readonly value = signal<number | null>(2.5);
}
