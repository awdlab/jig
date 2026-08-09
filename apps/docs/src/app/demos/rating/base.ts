import { Component, signal } from '@angular/core';
import { NgnRating } from '@awdlab/jig/rating';

@Component({
  selector: 'awd-demo-rating-base',
  imports: [NgnRating],
  template: `
    <awd-rating [value]="value()" (valueChange)="value.set($event)" />
    <br />
    {{ value() }}
  `,
})
export class Demo_Rating_Base {
  protected readonly value = signal<number | null>(3);
}
