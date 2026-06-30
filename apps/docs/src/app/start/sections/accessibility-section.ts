import { Component, signal } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';
import { NgnDialog } from '@ngneers/controls/dialog';
import { NgnInput } from '@ngneers/controls/input';
import { NgnInputField } from '@ngneers/controls/input-field';
import { NgnRovingGroup, NgnRovingItem } from '@ngneers/controls/roving-focus';
import { NgnSwitch } from '@ngneers/controls/switch';
import { injectToastCreator } from '@ngneers/controls/toast';

import { NgnDocsSectionShell } from './section-shell';

type A11yTopic = 'keyboard' | 'focus' | 'screen-reader' | 'aria';

interface A11yCard {
  id: A11yTopic;
  title: string;
  blurb: string;
}

@Component({
  selector: 'ngn-docs-accessibility-section',
  imports: [
    NgnDocsSectionShell,
    NgnRovingGroup,
    NgnRovingItem,
    NgnSwitch,
    NgnButton,
    NgnDialog,
    NgnInput,
    NgnInputField,
  ],
  template: `
    <ngn-docs-section-shell
      layout="split-left"
      eyebrow="Accessibility"
      heading="Accessible by default"
      subtitle="Keyboard, focus, screen-reader, and ARIA handled for you — pick a topic to see it in action."
    >
      <div primary>
        <ul class="flex flex-col gap-(--ngn-size-padding-md)">
          @for (card of cards; track card.id) {
            <li>
              <button
                type="button"
                [attr.aria-pressed]="selected() === card.id"
                (click)="selected.set(card.id)"
                class="card w-full cursor-pointer rounded-(--ngn-size-rounded-lg) border border-(--ngn-color-surface-200) p-(--ngn-size-padding-lg) text-left transition-colors"
                [class]="
                  selected() === card.id
                    ? 'border-(--ngn-color-primary-500) bg-(--ngn-color-primary-50) ring-2 ring-(--ngn-color-primary-500)'
                    : 'hover:border-(--ngn-color-surface-400)'
                "
              >
                <h3 class="font-(--ngn-font-weight-semibold) text-(--ngn-color-text)">
                  {{ card.title }}
                </h3>
                <p class="text-(length:--ngn-font-size-sm) text-(--ngn-color-surface-600)">
                  {{ card.blurb }}
                </p>
              </button>
            </li>
          }
        </ul>
      </div>

      <div secondary class="card p-(--ngn-size-padding-xl)">
        @switch (selected()) {
          @case ('keyboard') {
            <p class="mb-(--ngn-size-padding-lg) text-(--ngn-color-text)">
              Arrow-key navigation with a single tab stop. Tab in, then use ←/→ and Home/End.
            </p>
            <div
              ngnRovingGroup
              orientation="horizontal"
              rovingMode="tabindex"
              [rovingWrap]="true"
              (activeItemChange)="keyboardActive.set($event)"
              role="toolbar"
              aria-label="Keyboard navigation demo"
              class="flex flex-wrap gap-(--ngn-size-padding-md)"
            >
              @for (item of items; track item) {
                <button
                  ngnRovingItem
                  type="button"
                  class="card px-(--ngn-size-padding-lg) py-(--ngn-size-padding-md) text-(--ngn-color-text)"
                >
                  {{ item }}
                </button>
              }
            </div>
            <p
              class="mt-(--ngn-size-padding-lg) text-(length:--ngn-font-size-sm) text-(--ngn-color-surface-600)"
            >
              Active index:
              <strong class="text-(--ngn-color-text)">{{ keyboardActive() }}</strong>
              ({{ items[keyboardActive()] ?? '' }})
            </p>
          }

          @case ('focus') {
            <p class="mb-(--ngn-size-padding-lg) text-(--ngn-color-text)">
              Open the dialog, then press Tab — focus is trapped inside while it is open and returns
              to the trigger on close (Esc or backdrop). All handled by the native top-layer dialog,
              no extra code.
            </p>
            <button ngnButton kind="primary" (click)="dialogOpen.set(true)">Open dialog</button>

            <ngn-dialog [(open)]="dialogOpen" [modal]="true" title="Edit profile">
              <div class="flex flex-col gap-(--ngn-size-padding-lg)">
                <ngn-input-field label="Display name">
                  <input ngnInput placeholder="Ada Lovelace" />
                </ngn-input-field>
                <div class="flex justify-end gap-(--ngn-size-padding-md)">
                  <button ngnButton kind="secondary" (click)="dialogOpen.set(false)">Cancel</button>
                  <button ngnButton kind="primary" (click)="dialogOpen.set(false)">Save</button>
                </div>
              </div>
            </ngn-dialog>

            <p
              class="mt-(--ngn-size-padding-lg) text-(length:--ngn-font-size-sm) text-(--ngn-color-surface-600)"
            >
              Tab cycles only through the input and the two buttons — it never escapes to the page
              behind.
            </p>
          }

          @case ('screen-reader') {
            <p class="mb-(--ngn-size-padding-lg) text-(--ngn-color-text)">
              Trigger an action — the toast is announced to screen readers via the library's
              built-in live region. No <code class="text-(--ngn-color-primary-600)">aria-live</code>
              you write yourself.
            </p>
            <button ngnButton kind="primary" (click)="saveChanges()">Save changes</button>
            <p
              class="mt-(--ngn-size-padding-lg) text-(length:--ngn-font-size-sm) text-(--ngn-color-surface-600)"
            >
              The toast that appears carries its own announcement region, so assistive tech reads it
              out without any extra wiring.
            </p>
          }

          @case ('aria') {
            <p class="mb-(--ngn-size-padding-lg) text-(--ngn-color-text)">
              Toggle the switch — its ARIA contract updates live with the real control state.
            </p>
            <div class="flex items-center gap-(--ngn-size-padding-md)">
              <ngn-switch #notifySwitch [(value)]="ariaOn" />
              <label [for]="notifySwitch.inputId()" class="text-(--ngn-color-text)"
                >Notifications</label
              >
            </div>
            <dl
              class="mt-(--ngn-size-padding-lg) grid grid-cols-[auto_1fr] gap-x-(--ngn-size-padding-lg) gap-y-(--ngn-size-padding-sm) rounded-(--ngn-size-rounded-lg) border border-(--ngn-color-surface-200) p-(--ngn-size-padding-md) font-mono text-(length:--ngn-font-size-sm)"
            >
              <dt class="text-(--ngn-color-surface-600)">role</dt>
              <dd class="text-(--ngn-color-text)">switch</dd>
              <dt class="text-(--ngn-color-surface-600)">aria-checked</dt>
              <dd class="text-(--ngn-color-primary-600)">{{ ariaOn() }}</dd>
            </dl>
          }
        }
      </div>
    </ngn-docs-section-shell>
  `,
})
export class NgnDocsAccessibilitySection {
  private readonly _toastCreator = injectToastCreator();

  protected readonly items = ['Home', 'Search', 'Profile', 'Settings'];

  protected readonly selected = signal<A11yTopic>('keyboard');

  protected readonly keyboardActive = signal(0);
  protected readonly dialogOpen = signal(false);
  protected readonly ariaOn = signal(false);

  protected readonly cards: A11yCard[] = [
    {
      id: 'keyboard',
      title: 'Keyboard',
      blurb: 'Arrow keys, Home/End, and wrapping focus — no extra wiring.',
    },
    {
      id: 'focus',
      title: 'Focus management',
      blurb: 'A modal dialog traps focus while open and restores it on close.',
    },
    {
      id: 'screen-reader',
      title: 'Screen reader',
      blurb: 'Toasts announce updates through a built-in live region.',
    },
    {
      id: 'aria',
      title: 'ARIA',
      blurb: 'Roles and relationships are managed and stay in sync with state.',
    },
  ];

  /** Surfaces a library toast, which announces itself to screen readers via its own live region. */
  protected saveChanges(): void {
    this._toastCreator.show({
      header: 'Changes saved',
      content: 'Your profile has been updated.',
    });
  }
}
