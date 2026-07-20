import { Component, signal } from '@angular/core';
import { NgnOtp } from '@ngneers/controls/otp';

@Component({
  imports: [NgnOtp],
  selector: 'ngn-demo-otp-base',
  template: `
    <ngn-otp
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
