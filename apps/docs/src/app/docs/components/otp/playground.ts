import { Component, signal, viewChild } from '@angular/core';
import { NgnOtp } from '@ngneers/controls/otp';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'ngn-docs-otp-playground',
  imports: [NgnOtp, NgnDocsPlayground],
  template: `
    <ngn-docs-playground [controls]="[{ componentName: 'NgnOtp', component: component() }]">
      <ngn-otp #ref [value]="value()" (valueChange)="value.set($event)" />
    </ngn-docs-playground>
  `,
})
export class NgnDocsOtpPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnOtp });
  protected readonly value = signal<string | null>(null);
}
