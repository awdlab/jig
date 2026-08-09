import { Component, signal } from '@angular/core';
import { NgnOtp } from '@awdlab/jig/otp';

@Component({
  imports: [NgnOtp],
  selector: 'awd-demo-otp-mask',
  template: `
    <awd-otp [length]="4" mask integerOnly label="PIN" [(value)]="value" />
    <p class="mt-3">value: {{ value() ?? '—' }}</p>
  `,
})
export class Demo_Otp_Mask {
  protected readonly value = signal<string | null>(null);
}
