import { Component, signal } from '@angular/core';
import { AwdOtp } from '@awdlab/jig/otp';

@Component({
  imports: [AwdOtp],
  selector: 'jig-demo-otp-base',
  template: `
    <jig-otp
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
