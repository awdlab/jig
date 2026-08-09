import { Component } from '@angular/core';
import { NgnScrollShadow } from '@awdlab/jig/scroll-shadow';

@Component({
  imports: [NgnScrollShadow],
  selector: 'awd-demo-scroll-shadow-vertical',
  template: `
    <div ngnScrollShadow="vertical" class="box">
      @for (n of rows; track n) {
        <div class="row">Row {{ n }}</div>
      }
    </div>
  `,
  styles: `
    .box {
      height: 220px;
      max-width: 320px;
      overflow: auto;
      border: 1px solid var(--awd-color-surface-200);
      border-radius: var(--awd-size-radius-md);
    }
    .row {
      padding: 12px 16px;
      border-bottom: 1px solid var(--awd-color-surface-200);
    }
    .row:last-child {
      border-bottom: none;
    }
  `,
})
export class Demo_Scroll_Shadow_Vertical {
  protected readonly rows = Array.from({ length: 15 }, (_, i) => i + 1);
}
