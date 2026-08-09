import { Component, signal, viewChild } from '@angular/core';
import { JigOtp } from '@awdlab/jig/otp';

import { JigDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-otp-playground',
  imports: [JigOtp, JigDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'JigOtp', component: component() }]">
      <jig-otp #ref [value]="value()" (valueChange)="value.set($event)" />
    </jig-docs-playground>
  `,
})
export class JigDocsOtpPlayground {
  protected readonly component = viewChild.required('ref', { read: JigOtp });
  protected readonly value = signal<string | null>(null);
}
