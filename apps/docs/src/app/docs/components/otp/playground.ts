import { Component, signal, viewChild } from '@angular/core';
import { NgnOtp } from '@awdlab/jig/otp';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'awd-docs-otp-playground',
  imports: [NgnOtp, NgnDocsPlayground],
  template: `
    <awd-docs-playground [controls]="[{ componentName: 'NgnOtp', component: component() }]">
      <awd-otp #ref [value]="value()" (valueChange)="value.set($event)" />
    </awd-docs-playground>
  `,
})
export class NgnDocsOtpPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnOtp });
  protected readonly value = signal<string | null>(null);
}
