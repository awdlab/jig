import { Component } from '@angular/core';
import { JigMovable } from '@awdlab/jig/directives';

@Component({
  selector: 'jig-demo-movable-base',
  imports: [JigMovable],
  template: `
    <div class="board">
      <div jigMovable [jigMovableLimitToViewport]="false" class="card">Drag me anywhere</div>
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
      padding: 16px 20px;
      background: var(--jig-color-surface-100);
      border: 1px solid var(--jig-color-surface-300);
      border-radius: var(--jig-size-radius-md);
    }
  `,
})
export class Demo_Movable_Base {}
