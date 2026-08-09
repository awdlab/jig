import { Component, signal } from '@angular/core';
import { AwdButton } from '@awdlab/jig/button';
import { AwdInput } from '@awdlab/jig/input';
import { AwdKbd, AwdKeyboardShortcut } from '@awdlab/jig/kbd';

@Component({
  selector: 'jig-demo-kbd-shortcut-scope',
  imports: [AwdButton, AwdInput, AwdKbd, AwdKeyboardShortcut],
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
          Outer scope — focus a field below, then press <jig-kbd shortcut="mod+s" /> or
          <jig-kbd shortcut="escape" />
        </span>
        <input ngnInput placeholder="Outer field" />

        <div
          class="flex flex-col gap-2 rounded border border-dashed p-4"
          [ngnKeyboardShortcut]="[{ shortcut: 'mod+s', callback: () => log('inner: save') }]"
        >
          <span class="text-sm">
            Inner scope — handles <jig-kbd shortcut="mod+s" /> itself, so the outer scope never sees
            it. <jig-kbd shortcut="escape" /> still bubbles out.
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
