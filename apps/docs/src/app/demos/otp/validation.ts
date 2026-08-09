import { Component, computed, signal } from '@angular/core';
import { JigOtp } from '@awdlab/jig/otp';

const EXPECTED = '123456';

@Component({
  imports: [JigOtp],
  selector: 'jig-demo-otp-validation',
  template: `
    <jig-otp
      [length]="6"
      integerOnly
      label="Verification code"
      [invalid]="invalid()"
      [(value)]="value"
    />
    @if (verified()) {
      <p class="mt-3 text-success-600">Code verified.</p>
    } @else if (invalid()) {
      <p class="mt-3 text-error-600">Incorrect code — try {{ expected }}.</p>
    } @else {
      <p class="mt-3">Enter the 6-digit code (hint: {{ expected }}).</p>
    }
  `,
})
export class Demo_Otp_Validation {
  protected readonly expected = EXPECTED;
  protected readonly value = signal<string | null>(null);

  /** Complete but wrong. */
  protected readonly invalid = computed(() => {
    const v = this.value();
    return v !== null && v.length === EXPECTED.length && v !== EXPECTED;
  });

  protected readonly verified = computed(() => this.value() === EXPECTED);
}
