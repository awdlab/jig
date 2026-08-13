import { Component } from '@angular/core';
import { JigButton } from '@awdlab/jig/button';
import { JigToolbar, JigToolbarRegion } from '@awdlab/jig/toolbar';

@Component({
  selector: 'jig-demo-toolbar-priority',
  imports: [JigButton, JigToolbar, JigToolbarRegion],
  template: `<div class="max-w-72">
    <jig-toolbar overflow="popover">
      <!-- Rendered first, collapses first: priority beats visual order. -->
      <jig-toolbar-region placement="start" [priority]="1">
        <ng-template #item><button jigButton kind="text">Zoom in</button></ng-template>
        <ng-template #item><button jigButton kind="text">Zoom out</button></ng-template>
      </jig-toolbar-region>

      <jig-toolbar-region placement="start" [priority]="10">
        <ng-template #item><button jigButton kind="text">Save</button></ng-template>
        <ng-template #item><button jigButton kind="text">Undo</button></ng-template>
      </jig-toolbar-region>
    </jig-toolbar>
  </div>`,
})
export class Demo_Toolbar_Priority {}
