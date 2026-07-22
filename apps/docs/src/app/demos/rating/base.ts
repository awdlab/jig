import { Component, signal } from '@angular/core';
import { NgnRating } from '@ngneers/controls/rating';

@Component({
  selector: 'ngn-demo-rating-base',
  imports: [NgnRating],
  template: `
    <ngn-rating [value]="value()" (valueChange)="value.set($event)" />
    <br />
    {{ value() }}
  `,
})
export class Demo_Rating_Base {
  protected readonly value = signal<number | null>(3);
}
