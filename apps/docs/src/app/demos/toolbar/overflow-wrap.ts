import { Component } from '@angular/core';
import tablerBlockquote from '@iconify/icons-tabler/blockquote';
import tablerBold from '@iconify/icons-tabler/bold';
import tablerCode from '@iconify/icons-tabler/code';
import tablerItalic from '@iconify/icons-tabler/italic';
import tablerLink from '@iconify/icons-tabler/link';
import tablerList from '@iconify/icons-tabler/list';
import tablerListNumbers from '@iconify/icons-tabler/list-numbers';
import tablerPhoto from '@iconify/icons-tabler/photo';
import tablerStrikethrough from '@iconify/icons-tabler/strikethrough';
import tablerUnderline from '@iconify/icons-tabler/underline';
import { JigButton } from '@awdlab/jig/button';
import { JigIcon } from '@awdlab/jig/icon';
import { JigToolbar } from '@awdlab/jig/toolbar';
import { JigTooltip } from '@awdlab/jig/tooltip';

@Component({
  selector: 'jig-demo-toolbar-overflow-wrap',
  imports: [JigButton, JigIcon, JigToolbar, JigTooltip],
  template: `<div class="max-w-80">
    <jig-toolbar overflow="wrap">
      @for (action of actions; track action.label) {
        <button
          jigButton
          kind="text"
          color="surface"
          [attr.aria-label]="action.label"
          [jigTooltip]="action.label"
        >
          <jig-icon [icon]="action.icon" />
        </button>
      }
    </jig-toolbar>
  </div>`,
})
export class Demo_Toolbar_OverflowWrap {
  protected readonly actions = [
    { label: 'Bold', icon: tablerBold },
    { label: 'Italic', icon: tablerItalic },
    { label: 'Underline', icon: tablerUnderline },
    { label: 'Strikethrough', icon: tablerStrikethrough },
    { label: 'Bulleted list', icon: tablerList },
    { label: 'Numbered list', icon: tablerListNumbers },
    { label: 'Quote', icon: tablerBlockquote },
    { label: 'Code block', icon: tablerCode },
    { label: 'Link', icon: tablerLink },
    { label: 'Image', icon: tablerPhoto },
  ];
}
