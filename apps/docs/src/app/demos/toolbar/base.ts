import { Component, signal } from '@angular/core';
import tablerArrowBackUp from '@iconify/icons-tabler/arrow-back-up';
import tablerArrowForwardUp from '@iconify/icons-tabler/arrow-forward-up';
import tablerBold from '@iconify/icons-tabler/bold';
import tablerDeviceFloppy from '@iconify/icons-tabler/device-floppy';
import tablerItalic from '@iconify/icons-tabler/italic';
import tablerUnderline from '@iconify/icons-tabler/underline';
import { JigButton } from '@awdlab/jig/button';
import { JigIcon } from '@awdlab/jig/icon';
import { JigToolbar } from '@awdlab/jig/toolbar';
import { JigTooltip } from '@awdlab/jig/tooltip';

@Component({
  selector: 'jig-demo-toolbar-base',
  imports: [JigButton, JigIcon, JigToolbar, JigTooltip],
  template: `<jig-toolbar>
    <button jigButton kind="text" color="surface" aria-label="Undo" jigTooltip="Undo">
      <jig-icon [icon]="icons.undo" />
    </button>
    <button jigButton kind="text" color="surface" aria-label="Redo" jigTooltip="Redo">
      <jig-icon [icon]="icons.redo" />
    </button>

    <span class="mx-1 h-6 w-px self-center bg-[var(--jig-color-border)]" aria-hidden="true"></span>

    @for (format of formats; track format.key) {
      <button
        jigButton
        color="surface"
        [kind]="active().has(format.key) ? 'primary' : 'text'"
        [attr.aria-pressed]="active().has(format.key)"
        [attr.aria-label]="format.label"
        [jigTooltip]="format.label"
        (click)="toggle(format.key)"
      >
        <jig-icon [icon]="format.icon" />
      </button>
    }

    <button jigButton kind="primary" placement="end">
      <jig-icon [icon]="icons.save" />
      Save
    </button>
  </jig-toolbar>`,
})
export class Demo_Toolbar_Base {
  protected readonly icons = {
    undo: tablerArrowBackUp,
    redo: tablerArrowForwardUp,
    save: tablerDeviceFloppy,
  };

  protected readonly formats = [
    { key: 'bold', label: 'Bold', icon: tablerBold },
    { key: 'italic', label: 'Italic', icon: tablerItalic },
    { key: 'underline', label: 'Underline', icon: tablerUnderline },
  ] as const;

  protected readonly active = signal(new Set<string>(['bold']));

  protected toggle(key: string) {
    this.active.update(set => {
      const next = new Set(set);
      if (!next.delete(key)) {
        next.add(key);
      }
      return next;
    });
  }
}
