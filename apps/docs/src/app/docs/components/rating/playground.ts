import { Component, signal, viewChild } from '@angular/core';
import { NgnRating } from '@ngneers/controls/rating';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'ngn-docs-rating-playground',
  imports: [NgnRating, NgnDocsPlayground],
  template: `
    <ngn-docs-playground [controls]="[{ componentName: 'NgnRating', component: component() }]">
      <ngn-rating #ref [value]="value()" (valueChange)="value.set($event)" />
    </ngn-docs-playground>
  `,
})
export class NgnDocsRatingPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnRating });
  protected readonly value = signal<number | null>(3);
}
