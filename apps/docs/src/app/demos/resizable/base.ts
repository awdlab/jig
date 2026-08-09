import { Component } from '@angular/core';
import { JigResizable } from '@awdlab/jig/directives';

@Component({
  selector: 'jig-demo-resizable-base',
  imports: [JigResizable],
  template: `
    <div
      ngnResizable
      [ngnResizableSizeLimits]="{ minWidth: 180, minHeight: 100, maxWidth: 520, maxHeight: 320 }"
      class="panel"
    >
      Drag the bottom-right corner. The size stays between 180×100 and 520×320, and can never extend
      past the viewport.
    </div>
  `,
  styles: `
    .panel {
      width: 260px;
      height: 140px;
      overflow: auto;
      padding: 12px 16px;
      background: var(--jig-color-surface-100);
      border: 1px solid var(--jig-color-surface-300);
      border-radius: var(--jig-size-radius-md);
    }
  `,
})
export class Demo_Resizable_Base {}
