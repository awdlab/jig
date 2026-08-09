import { Component } from '@angular/core';
import { JigMovable } from '@awdlab/jig/directives';

@Component({
  selector: 'jig-demo-movable-handle',
  imports: [JigMovable],
  template: `
    <div class="board">
      <div
        ngnMovable
        [ngnMovableDragHandle]="handle"
        [ngnMovableLimitToViewport]="false"
        class="card"
      >
        <div #handle class="handle">Drag here</div>
        <div class="body">The body is not a drag handle — text stays selectable.</div>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
    }
    .board {
      position: relative;
      height: 260px;
      overflow: hidden;
      border: 1px dashed var(--jig-color-surface-300);
      border-radius: var(--jig-size-radius-md);
    }
    .card {
      position: absolute;
      top: 24px;
      left: 24px;
      width: 260px;
      background: var(--jig-color-surface-100);
      border: 1px solid var(--jig-color-surface-300);
      border-radius: var(--jig-size-radius-md);
      overflow: hidden;
    }
    .handle {
      padding: 8px 12px;
      background: var(--jig-color-surface-200);
      font-weight: 600;
    }
    .body {
      padding: 12px;
    }
  `,
})
export class Demo_Movable_Handle {}
