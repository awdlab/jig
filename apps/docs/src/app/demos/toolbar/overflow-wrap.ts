import { Component } from '@angular/core';
import { JigButton } from '@awdlab/jig/button';
import { JigToolbar } from '@awdlab/jig/toolbar';

@Component({
  selector: 'jig-demo-toolbar-overflow-wrap',
  imports: [JigButton, JigToolbar],
  template: `<div class="max-w-80">
    <jig-toolbar overflow="wrap">
      @for (label of labels; track label) {
        <button jigButton kind="text">{{ label }}</button>
      }
    </jig-toolbar>
  </div>`,
})
export class Demo_Toolbar_OverflowWrap {
  protected readonly labels = ['Bold', 'Italic', 'Underline', 'Strike', 'Link', 'Quote', 'Code'];
}
