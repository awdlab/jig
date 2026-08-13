import { Component, signal } from '@angular/core';
import tablerAlignCenter from '@iconify/icons-tabler/align-center';
import tablerAlignLeft from '@iconify/icons-tabler/align-left';
import tablerAlignRight from '@iconify/icons-tabler/align-right';
import tablerArrowBackUp from '@iconify/icons-tabler/arrow-back-up';
import tablerArrowForwardUp from '@iconify/icons-tabler/arrow-forward-up';
import tablerBold from '@iconify/icons-tabler/bold';
import tablerItalic from '@iconify/icons-tabler/italic';
import tablerLink from '@iconify/icons-tabler/link';
import tablerPhoto from '@iconify/icons-tabler/photo';
import tablerUnderline from '@iconify/icons-tabler/underline';
import { JigButton } from '@awdlab/jig/button';
import { JigIcon } from '@awdlab/jig/icon';
import { JigInputField } from '@awdlab/jig/input-field';
import { JigSelect } from '@awdlab/jig/select';
import { JigToolbar } from '@awdlab/jig/toolbar';
import { JigTooltip } from '@awdlab/jig/tooltip';

@Component({
  selector: 'jig-demo-toolbar-editor',
  imports: [JigButton, JigIcon, JigInputField, JigSelect, JigToolbar, JigTooltip],
  template: `<div class="flex flex-col">
    <jig-toolbar>
      <button jigButton kind="text" color="surface" aria-label="Undo" jigTooltip="Undo">
        <jig-icon [icon]="icons.undo" />
      </button>
      <button jigButton kind="text" color="surface" aria-label="Redo" jigTooltip="Redo">
        <jig-icon [icon]="icons.redo" />
      </button>

      <span class="mx-1 h-6 w-px bg-[var(--jig-color-border)]" aria-hidden="true"></span>

      <jig-input-field class="w-32">
        <jig-select [options]="blocks" [value]="block()" (valueChange)="block.set($event)" />
      </jig-input-field>

      @for (format of formats; track format.label) {
        <button
          jigButton
          color="surface"
          [kind]="active().has(format.label) ? 'primary' : 'text'"
          [attr.aria-pressed]="active().has(format.label)"
          [attr.aria-label]="format.label"
          [jigTooltip]="format.label"
          (click)="toggle(format.label)"
        >
          <jig-icon [icon]="format.icon" />
        </button>
      }

      <span class="mx-1 h-6 w-px bg-[var(--jig-color-border)]" aria-hidden="true"></span>

      @for (option of alignments; track option.value) {
        <button
          jigButton
          color="surface"
          [kind]="alignment() === option.value ? 'primary' : 'text'"
          [attr.aria-pressed]="alignment() === option.value"
          [attr.aria-label]="option.label + ' align'"
          [jigTooltip]="option.label + ' align'"
          (click)="alignment.set(option.value)"
        >
          <jig-icon [icon]="option.icon" />
        </button>
      }

      <button
        jigButton
        kind="text"
        color="surface"
        placement="end"
        aria-label="Insert link"
        jigTooltip="Link"
      >
        <jig-icon [icon]="icons.link" />
      </button>
      <button
        jigButton
        kind="text"
        color="surface"
        placement="end"
        aria-label="Insert image"
        jigTooltip="Image"
      >
        <jig-icon [icon]="icons.image" />
      </button>
    </jig-toolbar>

    <div
      class="mt-2 rounded-md border border-[var(--jig-color-border)] p-4 text-sm"
      [class.text-center]="alignment() === 'center'"
      [class.text-right]="alignment() === 'right'"
    >
      <span
        [class.font-bold]="active().has('Bold')"
        [class.italic]="active().has('Italic')"
        [class.underline]="active().has('Underline')"
      >
        The toolbar owns nothing but layout and focus — the editor below keeps the state.
      </span>
    </div>
  </div>`,
})
export class Demo_Toolbar_Editor {
  protected readonly icons = {
    undo: tablerArrowBackUp,
    redo: tablerArrowForwardUp,
    link: tablerLink,
    image: tablerPhoto,
  };

  protected readonly blocks = [
    { label: 'Paragraph', value: 'p' },
    { label: 'Heading 1', value: 'h1' },
    { label: 'Heading 2', value: 'h2' },
    { label: 'Quote', value: 'quote' },
  ];

  protected readonly formats = [
    { label: 'Bold', icon: tablerBold },
    { label: 'Italic', icon: tablerItalic },
    { label: 'Underline', icon: tablerUnderline },
  ];

  protected readonly alignments = [
    { label: 'Left', value: 'left', icon: tablerAlignLeft },
    { label: 'Center', value: 'center', icon: tablerAlignCenter },
    { label: 'Right', value: 'right', icon: tablerAlignRight },
  ];

  protected readonly block = signal<string | null>('p');
  protected readonly alignment = signal('left');
  protected readonly active = signal(new Set(['Bold']));

  protected toggle(label: string) {
    this.active.update(set => {
      const next = new Set(set);
      if (!next.delete(label)) {
        next.add(label);
      }
      return next;
    });
  }
}
