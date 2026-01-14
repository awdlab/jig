import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgnProgress } from '@ngneers/controls/progress';
import { interval } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-demo-progress-circular',
  imports: [NgnProgress],
  template: `
    <ngn-progress [value]="value()" circular [radius]="50" [thickness]="6" />
    {{ value() }}%
  `,
})
export class Demo_Progress_Circular {
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
