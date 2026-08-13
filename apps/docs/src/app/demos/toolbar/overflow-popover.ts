import { Component } from '@angular/core';
import { JigButton } from '@awdlab/jig/button';
import { JigToolbar, JigToolbarRegion } from '@awdlab/jig/toolbar';

@Component({
  selector: 'jig-demo-toolbar-overflow-popover',
  imports: [JigButton, JigToolbar, JigToolbarRegion],
  template: `<div class="max-w-96">
    <jig-toolbar overflow="popover">
      <jig-toolbar-region placement="start">
        <ng-template #item><button jigButton kind="text">Bold</button></ng-template>
        <ng-template #item><button jigButton kind="text">Italic</button></ng-template>
        <ng-template #item><button jigButton kind="text">Underline</button></ng-template>
        <ng-template #item><button jigButton kind="text">Strikethrough</button></ng-template>
        <ng-template #item><button jigButton kind="text">Highlight</button></ng-template>
      </jig-toolbar-region>
    </jig-toolbar>
  </div>`,
})
export class Demo_Toolbar_OverflowPopover {}
