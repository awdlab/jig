import { Component } from '@angular/core';
import { NgnMovable, NgnResizable } from '@ngneers/controls/directives';

@Component({
  selector: 'ngn-demo-resizable-movable',
  imports: [NgnMovable, NgnResizable],
  template: `
    <div class="board">
      <div
        ngnMovable
        ngnResizable
        [ngnMovableLimitToViewport]="false"
        [ngnResizableSizeLimits]="{
          minWidth: 160,
          minHeight: 90,
          maxWidth: null,
          maxHeight: null,
        }"
        class="panel"
      >
        Move me, then resize me — the position is baked before resizing, so the panel does not jump.
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
      height: 300px;
      overflow: hidden;
      border: 1px dashed var(--ngn-color-surface-300);
      border-radius: var(--ngn-size-radius-md);
    }
    .panel {
      position: absolute;
      top: 24px;
      left: 24px;
      width: 240px;
      height: 120px;
      overflow: auto;
      padding: 12px 16px;
      background: var(--ngn-color-surface-100);
      border: 1px solid var(--ngn-color-surface-300);
      border-radius: var(--ngn-size-radius-md);
    }
  `,
})
export class Demo_Resizable_Movable {}
