import { Component, signal } from '@angular/core';
import { NgnRating } from '@ngneers/controls/rating';

@Component({
  selector: 'ngn-demo-rating-half',
  imports: [NgnRating],
  template: `<ngn-rating [step]="0.5" [value]="value()" (valueChange)="value.set($event)" />`,
})
export class Demo_Rating_Half {
  protected readonly value = signal<number | null>(2.5);
}
