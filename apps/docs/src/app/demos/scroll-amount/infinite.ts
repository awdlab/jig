import { Component, signal } from '@angular/core';
import { JigScrollAmount } from '@awdlab/jig/directives';
import { JigSpinner } from '@awdlab/jig/spinner';

@Component({
  selector: 'jig-demo-scroll-amount-infinite',
  imports: [JigScrollAmount, JigSpinner],
  template: `
    <div ngnScrollAmount [ngnScrollAmountEndThreshold]="120" (endReached)="loadMore()" class="list">
      @for (row of rows(); track row) {
        <div class="row">Row {{ row }}</div>
      }
      @if (loading()) {
        <div class="row loading"><jig-spinner /> Loading…</div>
      }
    </div>
  `,
  styles: `
    .list {
      height: 220px;
      overflow: auto;
      border: 1px solid var(--jig-color-surface-300);
      border-radius: var(--jig-size-radius-md);
    }
    .row {
      padding: 10px 14px;
      border-bottom: 1px solid var(--jig-color-surface-200);
    }
    .loading {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `,
})
export class Demo_ScrollAmount_Infinite {
  protected readonly rows = signal(Array.from({ length: 20 }, (_, i) => i + 1));
  protected readonly loading = signal(false);

  protected loadMore(): void {
    if (this.loading() || this.rows().length >= 100) {
      return;
    }
    this.loading.set(true);
    setTimeout(() => {
      const next = this.rows().length;
      this.rows.update(rows => [...rows, ...Array.from({ length: 20 }, (_, i) => next + i + 1)]);
      this.loading.set(false);
    }, 600);
  }
}
