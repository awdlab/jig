import { Component, signal } from '@angular/core';
import { AwdRating } from '@awdlab/jig/rating';

@Component({
  selector: 'jig-demo-rating-base',
  imports: [AwdRating],
  template: `
    <jig-rating [value]="value()" (valueChange)="value.set($event)" />
    <br />
    {{ value() }}
  `,
})
export class Demo_Rating_Base {
  protected readonly value = signal<number | null>(3);
}
