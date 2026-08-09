import { Component } from '@angular/core';
import { NgnResizable } from '@awdlab/jig/directives';

@Component({
  selector: 'awd-demo-resizable-base',
  imports: [NgnResizable],
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
      background: var(--awd-color-surface-100);
      border: 1px solid var(--awd-color-surface-300);
      border-radius: var(--awd-size-radius-md);
    }
  `,
})
export class Demo_Resizable_Base {}
