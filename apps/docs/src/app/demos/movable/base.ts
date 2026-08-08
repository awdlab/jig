import { Component } from '@angular/core';
import { NgnMovable } from '@ngneers/controls/directives';

@Component({
  selector: 'ngn-demo-movable-base',
  imports: [NgnMovable],
  template: `
    <div class="board">
      <div ngnMovable [ngnMovableLimitToViewport]="false" class="card">Drag me anywhere</div>
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
      border: 1px dashed var(--ngn-color-surface-300);
      border-radius: var(--ngn-size-radius-md);
    }
    .card {
      position: absolute;
      top: 24px;
      left: 24px;
      padding: 16px 20px;
      background: var(--ngn-color-surface-100);
      border: 1px solid var(--ngn-color-surface-300);
      border-radius: var(--ngn-size-radius-md);
    }
  `,
})
export class Demo_Movable_Base {}
