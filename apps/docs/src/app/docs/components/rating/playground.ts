import { Component, signal, viewChild } from '@angular/core';
import { NgnRating } from '@awdlab/jig/rating';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'awd-docs-rating-playground',
  imports: [NgnRating, NgnDocsPlayground],
  template: `
    <awd-docs-playground [controls]="[{ componentName: 'NgnRating', component: component() }]">
      <awd-rating #ref [value]="value()" (valueChange)="value.set($event)" />
    </awd-docs-playground>
  `,
})
export class NgnDocsRatingPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnRating });
  protected readonly value = signal<number | null>(3);
}
