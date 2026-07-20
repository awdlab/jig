import { Component, signal } from '@angular/core';
import { NgnOtp } from '@ngneers/controls/otp';

@Component({
  imports: [NgnOtp],
  selector: 'ngn-demo-otp-mask',
  template: `
    <ngn-otp [length]="4" mask integerOnly label="PIN" [(value)]="value" />
    <p class="mt-3">value: {{ value() ?? '—' }}</p>
  `,
})
export class Demo_Otp_Mask {
  protected readonly value = signal<string | null>(null);
}
