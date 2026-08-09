import { Component } from '@angular/core';
import { JigScrollShadow } from '@awdlab/jig/scroll-shadow';

@Component({
  imports: [JigScrollShadow],
  selector: 'jig-demo-scroll-shadow-both',
  template: `
    <div jigScrollShadow="both" class="box">
      <div class="grid">
        @for (n of cells; track n) {
          <div class="cell">{{ n }}</div>
        }
      </div>
    </div>
  `,
  styles: `
    .box {
      height: 220px;
      max-width: 360px;
      overflow: auto;
      border: 1px solid var(--jig-color-surface-200);
      border-radius: var(--jig-size-radius-md);
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(8, 90px);
      gap: 8px;
      width: max-content;
      padding: 12px;
    }
    .cell {
      height: 70px;
      display: grid;
      place-items: center;
      background: var(--jig-color-surface-100);
      border-radius: var(--jig-size-radius-sm);
    }
  `,
})
export class Demo_Scroll_Shadow_Both {
  protected readonly cells = Array.from({ length: 40 }, (_, i) => i + 1);
}
