import { Component, viewChild } from '@angular/core';
import { JigSlider } from '@awdlab/jig/slider';

import { JigDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-slider-playground',
  imports: [JigSlider, JigDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'JigSlider', component: component() }]">
      <jig-slider class="flex-1" [class.h-[400px]]="component().vertical()" #ref />
    </jig-docs-playground>
  `,
})
export class JigDocsSliderPlayground {
  protected readonly component = viewChild.required('ref', { read: JigSlider });
}
