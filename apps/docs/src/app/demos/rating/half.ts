import { Component, signal } from '@angular/core';
import { NgnRating } from '@awdlab/jig/rating';

@Component({
  selector: 'awd-demo-rating-half',
  imports: [NgnRating],
  template: `<awd-rating [step]="0.5" [value]="value()" (valueChange)="value.set($event)" />`,
})
export class Demo_Rating_Half {
  protected readonly value = signal<number | null>(2.5);
}
