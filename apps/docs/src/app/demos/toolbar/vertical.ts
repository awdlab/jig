import { Component, signal } from '@angular/core';
import tablerEraser from '@iconify/icons-tabler/eraser';
import tablerHandMove from '@iconify/icons-tabler/hand-move';
import tablerPencil from '@iconify/icons-tabler/pencil';
import tablerPhoto from '@iconify/icons-tabler/photo';
import tablerPointer from '@iconify/icons-tabler/pointer';
import tablerShape from '@iconify/icons-tabler/shape';
import tablerTypography from '@iconify/icons-tabler/typography';
import { JigButton } from '@awdlab/jig/button';
import { JigIcon } from '@awdlab/jig/icon';
import { JigToolbar, JigToolbarRegion } from '@awdlab/jig/toolbar';
import { JigTooltip } from '@awdlab/jig/tooltip';

@Component({
  selector: 'jig-demo-toolbar-vertical',
  imports: [JigButton, JigIcon, JigToolbar, JigToolbarRegion, JigTooltip],
  // The height is what makes vertical overflow possible: an unbounded column
  // always fits its own content, so nothing would ever collapse.
  template: `<div class="h-56">
    <jig-toolbar orientation="vertical" overflow="popover" class="w-fit">
      <jig-toolbar-region placement="start">
        @for (tool of tools; track tool.label) {
          <ng-template #item let-ctx>
            <button
              jigButton
              color="surface"
              [kind]="active() === tool.label ? 'primary' : 'text'"
              [attr.aria-pressed]="active() === tool.label"
              [attr.aria-label]="ctx.overflowed ? null : tool.label"
              [jigTooltip]="ctx.overflowed ? '' : tool.label"
              [jigTooltipPlacement]="'right'"
              (click)="active.set(tool.label)"
            >
              <jig-icon [icon]="tool.icon" />
              @if (ctx.overflowed) {
                {{ tool.label }}
              }
            </button>
          </ng-template>
        }
      </jig-toolbar-region>
    </jig-toolbar>
  </div>`,
})
export class Demo_Toolbar_Vertical {
  protected readonly tools = [
    { label: 'Select', icon: tablerPointer },
    { label: 'Pan', icon: tablerHandMove },
    { label: 'Pen', icon: tablerPencil },
    { label: 'Shape', icon: tablerShape },
    { label: 'Text', icon: tablerTypography },
    { label: 'Image', icon: tablerPhoto },
    { label: 'Eraser', icon: tablerEraser },
  ];

  protected readonly active = signal('Select');
}
