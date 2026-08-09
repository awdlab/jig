import { Component, signal } from '@angular/core';
import { NgnButton } from '@awdlab/jig/button';
import { NgnInput } from '@awdlab/jig/input';
import { NgnKbd, NgnKeyboardShortcut } from '@awdlab/jig/kbd';

@Component({
  selector: 'awd-demo-kbd-shortcut-scope',
  imports: [NgnButton, NgnInput, NgnKbd, NgnKeyboardShortcut],
  template: `
    <div class="flex flex-col gap-4 p-4">
      <div
        class="flex flex-col gap-2 rounded border border-dashed p-4"
        [ngnKeyboardShortcut]="[
          { shortcut: 'mod+s', callback: () => log('outer: save') },
          { shortcut: 'escape', callback: () => log('outer: escape') },
        ]"
      >
        <span class="text-sm">
          Outer scope — focus a field below, then press <awd-kbd shortcut="mod+s" /> or
          <awd-kbd shortcut="escape" />
        </span>
        <input ngnInput placeholder="Outer field" />

        <div
          class="flex flex-col gap-2 rounded border border-dashed p-4"
          [ngnKeyboardShortcut]="[{ shortcut: 'mod+s', callback: () => log('inner: save') }]"
        >
          <span class="text-sm">
            Inner scope — handles <awd-kbd shortcut="mod+s" /> itself, so the outer scope never sees
            it. <awd-kbd shortcut="escape" /> still bubbles out.
          </span>
          <input ngnInput placeholder="Inner field" />
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button ngnButton (click)="entries.set([])">Clear log</button>
        <span class="text-sm">{{ entries().join(' · ') || 'nothing yet' }}</span>
      </div>
    </div>
  `,
})
export class Demo_Kbd_ShortcutScope {
  protected readonly entries = signal<string[]>([]);

  protected log(entry: string): void {
    this.entries.update(list => [...list, entry]);
  }
}
