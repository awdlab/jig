import { Component, signal } from '@angular/core';
import { JigOtp } from '@awdlab/jig/otp';

@Component({
  imports: [JigOtp],
  selector: 'jig-demo-otp-length',
  template: `
    <div class="flex flex-col gap-6">
      <div>
        <p class="mb-2">4 cells</p>
        <jig-otp [length]="4" integerOnly [(value)]="short" />
      </div>
      <div>
        <p class="mb-2">8 cells, alphanumeric</p>
        <jig-otp [length]="8" [(value)]="long" />
      </div>
    </div>
  `,
})
export class Demo_Otp_Length {
  protected readonly short = signal<string | null>(null);
  protected readonly long = signal<string | null>(null);
}
