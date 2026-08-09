import { Component } from '@angular/core';
import { AwdDragScroll } from '@awdlab/jig/directives';

@Component({
  selector: 'jig-demo-drag-scroll',
  imports: [AwdDragScroll],
  template: `
    <div ngnDragScroll class="canvas">
      <div class="grid">
        @for (cell of cells; track cell) {
          <div class="cell">{{ cell }}</div>
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
      user-select: none;
    }
    .canvas {
      height: 240px;
      overflow: auto;
      cursor: grab;
      touch-action: none;
      border: 1px solid var(--jig-color-surface-300);
      border-radius: var(--jig-size-radius-md);
    }
    .canvas:active {
      cursor: grabbing;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(12, 120px);
      gap: 8px;
      padding: 8px;
    }
    .cell {
      height: 80px;
      display: grid;
      place-items: center;
      background: var(--jig-color-surface-100);
      border-radius: var(--jig-size-radius-sm);
    }
  `,
})
export class Demo_Drag_Scroll {
  protected readonly cells = Array.from({ length: 60 }, (_, i) => `#${i + 1}`);
}
