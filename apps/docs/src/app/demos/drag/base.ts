import { Component, signal } from '@angular/core';
import { AwdDrag } from '@awdlab/jig/directives';

import type { AwdDragInfo } from '@awdlab/jig/directives';

@Component({
  selector: 'jig-demo-drag-base',
  imports: [AwdDrag],
  template: `
    <div class="flex flex-col gap-3">
      <div
        ngnDrag
        class="pad"
        (dragStart)="dragging.set(true)"
        (dragEnd)="dragging.set(false)"
        (dragged)="onDragged($event)"
      >
        <div>{{ dragging() ? 'Dragging…' : 'Press and drag here' }}</div>

        <button type="button" class="inner-button" (click)="clicks.set(clicks() + 1)">
          Click me — but a drag ending here does not count
        </button>
      </div>

      <output class="readout">
        offset: {{ offsetX() }} / {{ offsetY() }} px · clicks: {{ clicks() }}
      </output>
    </div>
  `,
  styles: `
    :host {
      user-select: none;
    }
    .pad {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 20px;
      text-align: center;
      background: var(--jig-color-surface-100);
      border: 1px solid var(--jig-color-surface-300);
      border-radius: var(--jig-size-radius-md);
      touch-action: none;
    }
    .inner-button {
      padding: 8px 16px;
      background: var(--jig-color-surface-200);
      border: 1px solid var(--jig-color-surface-300);
      border-radius: var(--jig-size-radius-sm);
    }
    .readout {
      font-family: monospace;
    }
  `,
})
export class Demo_Drag_Base {
  protected readonly dragging = signal(false);
  protected readonly offsetX = signal(0);
  protected readonly offsetY = signal(0);
  protected readonly clicks = signal(0);

  protected onDragged(info: AwdDragInfo): void {
    this.offsetX.update(x => x + info.deltaX);
    this.offsetY.update(y => y + info.deltaY);
  }
}
