import { Component, signal } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';
import { NgnDialog } from '@ngneers/controls/dialog';
import { NgnPopover } from '@ngneers/controls/popover';

import { NgnDocsSectionShell } from './section-shell';

@Component({
  selector: 'ngn-docs-native-platform-section',
  imports: [NgnDocsSectionShell, NgnButton, NgnDialog, NgnPopover],
  template: `
    <ngn-docs-section-shell
      layout="centered"
      eyebrow="Native to the platform"
      heading="Built on browser primitives"
      subtitle="Dialogs and popovers use the native top layer — no z-index wars, works inside Shadow DOM, SSR-safe."
    >
      <div class="mx-auto flex max-w-[640px] flex-col items-center gap-(--ngn-size-padding-xl)">
        <span
          class="inline-flex items-center rounded-lg bg-(--ngn-color-primary-50) px-(--ngn-size-padding-lg) py-(--ngn-size-padding-sm) text-(length:--ngn-font-size-sm) font-(--ngn-font-weight-semibold) text-(--ngn-color-primary-700)"
        >
          Native top layer — no z-index wars
        </span>

        <div class="flex flex-wrap justify-center gap-(--ngn-size-padding-lg)">
          <button ngnButton kind="primary" (click)="dialogOpen.set(true)">
            Open native dialog
          </button>
          <button
            ngnButton
            kind="secondary"
            #popBtn
            aria-haspopup="dialog"
            [attr.aria-expanded]="popover.open()"
            (click)="popover.toggle()"
          >
            Open popover
          </button>
        </div>
      </div>

      <ngn-dialog [(open)]="dialogOpen" [modal]="true" title="Native dialog">
        <p class="text-(--ngn-color-text)">
          Rendered in the browser's top layer via <code>showModal()</code>. Press Esc or click the
          backdrop to close.
        </p>
      </ngn-dialog>

      <ngn-popover #popover [anchor]="popBtn">
        <p class="p-(--ngn-size-padding-lg) text-(--ngn-color-text)">
          Anchored via the native Popover API.
        </p>
      </ngn-popover>
    </ngn-docs-section-shell>
  `,
})
export class NgnDocsNativePlatformSection {
  protected readonly dialogOpen = signal(false);
}
