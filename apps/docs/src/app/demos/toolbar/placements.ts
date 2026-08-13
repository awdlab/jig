import { Component, signal } from '@angular/core';
import tablerFileText from '@iconify/icons-tabler/file-text';
import tablerSearch from '@iconify/icons-tabler/search';
import tablerShare from '@iconify/icons-tabler/share';
import tablerUser from '@iconify/icons-tabler/user';
import { JigButton } from '@awdlab/jig/button';
import { JigIcon } from '@awdlab/jig/icon';
import { JigInput } from '@awdlab/jig/input';
import { JigInputField } from '@awdlab/jig/input-field';
import { JigToolbar } from '@awdlab/jig/toolbar';
import { JigTooltip } from '@awdlab/jig/tooltip';

@Component({
  selector: 'jig-demo-toolbar-placements',
  imports: [JigButton, JigIcon, JigInput, JigInputField, JigToolbar, JigTooltip],
  template: `<jig-toolbar>
    <jig-icon [icon]="icons.file" class="text-[var(--jig-color-primary-500)]" />
    <strong>Quarterly report</strong>
    <span class="text-sm text-[var(--jig-color-surface-500)]">Saved</span>

    <jig-input-field placement="center" showClearButton class="w-56">
      <input
        jigInput
        placeholder="Search document"
        [value]="query()"
        (valueChange)="query.set($event ?? '')"
      />
      <jig-icon [icon]="icons.search" />
    </jig-input-field>

    <button jigButton kind="text" color="surface" placement="end">
      <jig-icon [icon]="icons.share" />
      Share
    </button>
    <button
      jigButton
      kind="icon"
      color="surface"
      placement="end"
      aria-label="Account"
      jigTooltip="Janik S."
    >
      <jig-icon [icon]="icons.user" />
    </button>
  </jig-toolbar>`,
})
export class Demo_Toolbar_Placements {
  protected readonly icons = {
    file: tablerFileText,
    search: tablerSearch,
    share: tablerShare,
    user: tablerUser,
  };
  protected readonly query = signal('');
}
