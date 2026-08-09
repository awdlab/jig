import { Component } from '@angular/core';
import { NgnScrollShadow } from '@awdlab/jig/scroll-shadow';

@Component({
  imports: [NgnScrollShadow],
  selector: 'awd-demo-scroll-shadow-horizontal',
  template: `
    <div ngnScrollShadow="horizontal" class="box">
      <div class="row">
        @for (n of cards; track n) {
          <div class="card">Card {{ n }}</div>
        }
      </div>
    </div>
  `,
  styles: `
    .box {
      max-width: 100%;
      overflow: auto;
      border: 1px solid var(--awd-color-surface-200);
      border-radius: var(--awd-size-radius-md);
    }
    .row {
      display: flex;
      gap: 12px;
      width: max-content;
      padding: 12px;
    }
    .card {
      flex: 0 0 140px;
      height: 90px;
      display: grid;
      place-items: center;
      background: var(--awd-color-surface-100);
      border-radius: var(--awd-size-radius-sm);
    }
  `,
})
export class Demo_Scroll_Shadow_Horizontal {
  protected readonly cards = Array.from({ length: 10 }, (_, i) => i + 1);
}
