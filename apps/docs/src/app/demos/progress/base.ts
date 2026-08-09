import { Component, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgnProgress } from '@awdlab/jig/progress';
import { interval } from 'rxjs';

@Component({
  selector: 'awd-demo-progress-base',
  imports: [NgnProgress],
  template: `
    <awd-progress [value]="value()" />
    {{ value() }}%
  `,
  host: { class: 'flex-1 max-w-100' },
})
export class Demo_Progress_Base {
  protected readonly value = signal(50);
  constructor() {
    interval(1000)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        const increment = Math.floor(10 + 10 * Math.random());
        this.value.update(v => (v + increment) % 100);
      });
  }
}
