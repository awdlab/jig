import { Component, signal, viewChild } from '@angular/core';
import { AwdOtp } from '@awdlab/jig/otp';

import { AwdDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-otp-playground',
  imports: [AwdOtp, AwdDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'AwdOtp', component: component() }]">
      <jig-otp #ref [value]="value()" (valueChange)="value.set($event)" />
    </jig-docs-playground>
  `,
})
export class AwdDocsOtpPlayground {
  protected readonly component = viewChild.required('ref', { read: AwdOtp });
  protected readonly value = signal<string | null>(null);
}
