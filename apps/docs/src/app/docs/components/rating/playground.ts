import { Component, signal, viewChild } from '@angular/core';
import { JigRating } from '@awdlab/jig/rating';

import { JigDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-rating-playground',
  imports: [JigRating, JigDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'JigRating', component: component() }]">
      <jig-rating #ref [value]="value()" (valueChange)="value.set($event)" />
    </jig-docs-playground>
  `,
})
export class JigDocsRatingPlayground {
  protected readonly component = viewChild.required('ref', { read: JigRating });
  protected readonly value = signal<number | null>(3);
}
