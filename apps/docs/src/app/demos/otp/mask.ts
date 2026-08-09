import { Component, signal } from '@angular/core';
import { JigOtp } from '@awdlab/jig/otp';

@Component({
  imports: [JigOtp],
  selector: 'jig-demo-otp-mask',
  template: `
    <jig-otp [length]="4" mask integerOnly label="PIN" [(value)]="value" />
    <p class="mt-3">value: {{ value() ?? '—' }}</p>
  `,
})
export class Demo_Otp_Mask {
  protected readonly value = signal<string | null>(null);
}
