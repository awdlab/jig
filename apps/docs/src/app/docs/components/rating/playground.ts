import { Component, signal, viewChild } from '@angular/core';
import { AwdRating } from '@awdlab/jig/rating';

import { AwdDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-rating-playground',
  imports: [AwdRating, AwdDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'AwdRating', component: component() }]">
      <jig-rating #ref [value]="value()" (valueChange)="value.set($event)" />
    </jig-docs-playground>
  `,
})
export class AwdDocsRatingPlayground {
  protected readonly component = viewChild.required('ref', { read: AwdRating });
  protected readonly value = signal<number | null>(3);
}
