import { Component, signal } from '@angular/core';
import { NgnOtp } from '@awdlab/jig/otp';

@Component({
  imports: [NgnOtp],
  selector: 'awd-demo-otp-base',
  template: `
    <awd-otp
      [length]="6"
      integerOnly
      label="One-time password"
      [(value)]="value"
      (completed)="onCompleted($event)"
    />
    <p class="mt-3">value: {{ value() ?? '—' }}</p>
    @if (lastCompleted()) {
      <p class="mt-1">last completed: {{ lastCompleted() }}</p>
    }
  `,
})
export class Demo_Otp_Base {
  protected readonly value = signal<string | null>(null);
  protected readonly lastCompleted = signal<string | null>(null);

  protected onCompleted(code: string): void {
    this.lastCompleted.set(code);
  }
}
