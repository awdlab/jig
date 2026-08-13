import { Component } from '@angular/core';
import { JigButton } from '@awdlab/jig/button';
import { JigToolbar, JigToolbarRegion } from '@awdlab/jig/toolbar';

@Component({
  selector: 'jig-demo-toolbar-vertical',
  imports: [JigButton, JigToolbar, JigToolbarRegion],
  // The height is what makes vertical overflow possible: an unbounded column
  // always fits its own content, so nothing would ever collapse.
  template: `<div class="h-56">
    <jig-toolbar orientation="vertical" overflow="popover">
      <jig-toolbar-region placement="start">
        <ng-template #item><button jigButton kind="text">Select</button></ng-template>
        <ng-template #item><button jigButton kind="text">Pen</button></ng-template>
        <ng-template #item><button jigButton kind="text">Shape</button></ng-template>
        <ng-template #item><button jigButton kind="text">Text</button></ng-template>
        <ng-template #item><button jigButton kind="text">Image</button></ng-template>
      </jig-toolbar-region>
    </jig-toolbar>
  </div>`,
})
export class Demo_Toolbar_Vertical {}
