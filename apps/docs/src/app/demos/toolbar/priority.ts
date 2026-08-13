import { Component } from '@angular/core';
import tablerArrowBackUp from '@iconify/icons-tabler/arrow-back-up';
import tablerDeviceFloppy from '@iconify/icons-tabler/device-floppy';
import tablerZoomIn from '@iconify/icons-tabler/zoom-in';
import tablerZoomOut from '@iconify/icons-tabler/zoom-out';
import { JigButton } from '@awdlab/jig/button';
import { JigIcon } from '@awdlab/jig/icon';
import { JigToolbar, JigToolbarRegion } from '@awdlab/jig/toolbar';
import { JigTooltip } from '@awdlab/jig/tooltip';

@Component({
  selector: 'jig-demo-toolbar-priority',
  imports: [JigButton, JigIcon, JigToolbar, JigToolbarRegion, JigTooltip],
  template: `<div class="max-w-72">
    <jig-toolbar overflow="popover">
      <!-- Rendered first, collapses first: priority beats visual order. -->
      <jig-toolbar-region placement="start" [priority]="1">
        <ng-template #item>
          <button jigButton kind="text" color="surface" aria-label="Zoom in" jigTooltip="Zoom in">
            <jig-icon [icon]="icons.zoomIn" />
          </button>
        </ng-template>
        <ng-template #item>
          <button jigButton kind="text" color="surface" aria-label="Zoom out" jigTooltip="Zoom out">
            <jig-icon [icon]="icons.zoomOut" />
          </button>
        </ng-template>
      </jig-toolbar-region>

      <jig-toolbar-region placement="start" [priority]="10">
        <ng-template #item>
          <button jigButton kind="text" color="surface">
            <jig-icon [icon]="icons.undo" />
            Undo
          </button>
        </ng-template>
        <ng-template #item>
          <button jigButton kind="primary">
            <jig-icon [icon]="icons.save" />
            Save
          </button>
        </ng-template>
      </jig-toolbar-region>
    </jig-toolbar>
  </div>`,
})
export class Demo_Toolbar_Priority {
  protected readonly icons = {
    zoomIn: tablerZoomIn,
    zoomOut: tablerZoomOut,
    undo: tablerArrowBackUp,
    save: tablerDeviceFloppy,
  };
}
