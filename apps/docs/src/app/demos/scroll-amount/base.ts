import { Component, viewChild } from '@angular/core';
import { JigScrollAmount } from '@awdlab/jig/directives';

@Component({
  selector: 'jig-demo-scroll-amount-base',
  imports: [JigScrollAmount],
  template: `
    <div class="flex flex-col gap-3">
      <div ngnScrollAmount class="list">
        @for (row of rows; track row) {
          <div class="row">Row {{ row }}</div>
        }
      </div>

      <output class="readout">
        scrollTop: {{ scroll()?.scrollTop() }} · distanceFromEnd: {{ scroll()?.distanceFromEnd() }}
      </output>
    </div>
  `,
  styles: `
    .list {
      height: 200px;
      overflow: auto;
      border: 1px solid var(--jig-color-surface-300);
      border-radius: var(--jig-size-radius-md);
    }
    .row {
      padding: 10px 14px;
      border-bottom: 1px solid var(--jig-color-surface-200);
    }
    .readout {
      font-family: monospace;
    }
  `,
})
export class Demo_ScrollAmount_Base {
  protected readonly scroll = viewChild(JigScrollAmount);
  protected readonly rows = Array.from({ length: 30 }, (_, i) => i + 1);
}
