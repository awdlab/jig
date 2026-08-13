import { Component } from '@angular/core';
import tablerBlockquote from '@iconify/icons-tabler/blockquote';
import tablerBold from '@iconify/icons-tabler/bold';
import tablerCode from '@iconify/icons-tabler/code';
import tablerItalic from '@iconify/icons-tabler/italic';
import tablerLink from '@iconify/icons-tabler/link';
import tablerList from '@iconify/icons-tabler/list';
import tablerPhoto from '@iconify/icons-tabler/photo';
import tablerStrikethrough from '@iconify/icons-tabler/strikethrough';
import tablerUnderline from '@iconify/icons-tabler/underline';
import { JigButton } from '@awdlab/jig/button';
import { JigIcon } from '@awdlab/jig/icon';
import { JigToolbar, JigToolbarRegion } from '@awdlab/jig/toolbar';
import { JigTooltip } from '@awdlab/jig/tooltip';

@Component({
  selector: 'jig-demo-toolbar-overflow-popover',
  imports: [JigButton, JigIcon, JigToolbar, JigToolbarRegion, JigTooltip],
  // Icon-only in the bar, icon plus label in the popover — one template, two renderings.
  template: `<div class="max-w-96">
    <jig-toolbar overflow="popover">
      <jig-toolbar-region placement="start">
        @for (action of actions; track action.label) {
          <ng-template #item let-ctx>
            <button
              jigButton
              kind="text"
              color="surface"
              [class.w-full]="ctx.overflowed"
              [class.justify-start]="ctx.overflowed"
              [attr.aria-label]="ctx.overflowed ? null : action.label"
              [jigTooltip]="ctx.overflowed ? '' : action.label"
            >
              <jig-icon [icon]="action.icon" />
              @if (ctx.overflowed) {
                {{ action.label }}
              }
            </button>
          </ng-template>
        }
      </jig-toolbar-region>
    </jig-toolbar>
  </div>`,
})
export class Demo_Toolbar_OverflowPopover {
  protected readonly actions = [
    { label: 'Bold', icon: tablerBold },
    { label: 'Italic', icon: tablerItalic },
    { label: 'Underline', icon: tablerUnderline },
    { label: 'Strikethrough', icon: tablerStrikethrough },
    { label: 'Bulleted list', icon: tablerList },
    { label: 'Quote', icon: tablerBlockquote },
    { label: 'Code block', icon: tablerCode },
    { label: 'Link', icon: tablerLink },
    { label: 'Image', icon: tablerPhoto },
  ];
}
