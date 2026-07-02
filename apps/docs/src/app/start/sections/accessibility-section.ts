import { Component, DestroyRef, afterNextRender, inject, signal } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';
import { NgnDialog } from '@ngneers/controls/dialog';
import { NgnInput } from '@ngneers/controls/input';
import { NgnInputField } from '@ngneers/controls/input-field';
import { NgnRovingGroup, NgnRovingItem } from '@ngneers/controls/roving-focus';
import { NgnSwitch } from '@ngneers/controls/switch';
import { injectToastCreator } from '@ngneers/controls/toast';

import { NgnDocsSectionShell } from './section-shell';

/** One beat of the autoplay script: which keycap flashes and where the ring lands. */
interface TheaterStep {
  key: string;
  /** 0–3 = toolbar buttons, 4 = the switch. */
  target: number;
  /** Toggle the switch on this beat. */
  toggles?: boolean;
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
      subtitle="Watch the keyboard drive real controls — focus, screen-reader announcements, and ARIA are wired in from the start, on every control."
    >
      <div primary>
        <!-- Self-playing keyboard. -->
        <div
          class="card flex flex-col items-center gap-(--ngn-size-padding-lg) p-(--ngn-size-padding-xl)"
        >
          <div class="flex flex-wrap justify-center gap-(--ngn-size-padding-sm)">
            @for (key of keys; track key) {
              <span class="ngn-keycap" [class.ngn-keycap-pressed]="pressedKey() === key">
                {{ key }}
              </span>
            }
          </div>
          <p class="text-center text-(length:--ngn-font-size-sm) text-(--ngn-color-surface-500)">
            No video, no mockup — the stage next to this is real library code, driven by the same
            key handling your users get.
          </p>
        </div>

        <!-- ARIA readout for wherever the ring currently sits. -->
        <dl
          class="card mt-(--ngn-size-padding-lg) grid grid-cols-[auto_1fr] gap-x-(--ngn-size-padding-xl) gap-y-(--ngn-size-padding-sm) p-(--ngn-size-padding-lg) font-mono text-(length:--ngn-font-size-sm)"
        >
          <dt class="text-(--ngn-color-surface-600)">element</dt>
          <dd class="text-(--ngn-color-text)">{{ currentTargetLabel() }}</dd>
          <dt class="text-(--ngn-color-surface-600)">role</dt>
          <dd class="text-(--ngn-color-text)">{{ simIndex() === 4 ? 'switch' : 'button' }}</dd>
          <dt class="text-(--ngn-color-surface-600)">
            {{ simIndex() === 4 ? 'aria-checked' : 'tabindex' }}
          </dt>
          <dd class="text-(--ngn-color-primary-600)">
            {{ simIndex() === 4 ? switchOn() : '0 — single tab stop' }}
          </dd>
        </dl>
      </div>

      <div
        secondary
        class="card flex flex-col gap-(--ngn-size-padding-xl) p-(--ngn-size-padding-xl)"
      >
        <!-- Watch-only stage: inert so real focus never lands here — the real
             focus styles differ from the simulated ring and would confuse. -->
        <div
          inert
          class="pointer-events-none flex flex-col gap-(--ngn-size-padding-xl) select-none"
        >
          <div>
            <p
              class="mb-(--ngn-size-padding-md) text-(length:--ngn-font-size-sm) font-(--ngn-font-weight-semibold) text-(--ngn-color-surface-500)"
            >
              Toolbar — one tab stop, arrows inside
            </p>
            <div
              ngnRovingGroup
              orientation="horizontal"
              rovingMode="tabindex"
              [rovingWrap]="true"
              role="toolbar"
              aria-label="Keyboard navigation demo"
              class="flex flex-wrap gap-(--ngn-size-padding-md)"
            >
              @for (item of items; track item; let i = $index) {
                <button
                  ngnRovingItem
                  type="button"
                  class="card px-(--ngn-size-padding-lg) py-(--ngn-size-padding-md) text-(--ngn-color-text)"
                  [class.ngn-sim-focus]="simIndex() === i"
                >
                  {{ item }}
                </button>
              }
            </div>
          </div>

          <div>
            <p
              class="mb-(--ngn-size-padding-md) text-(length:--ngn-font-size-sm) font-(--ngn-font-weight-semibold) text-(--ngn-color-surface-500)"
            >
              Switch — ARIA state stays in sync
            </p>
            <div
              class="flex w-fit items-center gap-(--ngn-size-padding-md) rounded-(--ngn-size-rounded-md) p-(--ngn-size-padding-xs)"
              [class.ngn-sim-focus]="simIndex() === 4"
            >
              <ngn-switch #notifySwitch [(value)]="switchOn" />
              <label [for]="notifySwitch.inputId()" class="text-(--ngn-color-text)">
                Notifications
              </label>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap gap-(--ngn-size-padding-md)">
          <button ngnButton kind="secondary" (click)="dialogOpen.set(true)">
            Focus-trapped dialog
          </button>
          <button ngnButton kind="secondary" (click)="announce()">Screen-reader toast</button>
        </div>
      </div>
    </ngn-docs-section-shell>

    <ngn-dialog [(open)]="dialogOpen" [modal]="true" title="Edit profile">
      <div class="flex flex-col gap-(--ngn-size-padding-lg)">
        <p class="max-w-[40ch] text-(length:--ngn-font-size-sm) text-(--ngn-color-surface-600)">
          Press Tab — focus is trapped in here while open and returns to the trigger on close. All
          native top-layer dialog, no extra code.
        </p>
        <ngn-input-field label="Display name">
          <input ngnInput placeholder="Ada Lovelace" />
        </ngn-input-field>
        <div class="flex justify-end gap-(--ngn-size-padding-md)">
          <button ngnButton kind="secondary" (click)="dialogOpen.set(false)">Cancel</button>
          <button ngnButton kind="primary" (click)="dialogOpen.set(false)">Save</button>
        </div>
      </div>
    </ngn-dialog>
  `,
})
export class NgnDocsAccessibilitySection {
  private readonly _toastCreator = injectToastCreator();

  protected readonly items = ['Home', 'Search', 'Profile', 'Settings'];
  protected readonly keys = ['Tab', '←', '→', 'Home', 'End', 'Space'];

  protected readonly pressedKey = signal<string | null>(null);
  protected readonly simIndex = signal(0);
  protected readonly switchOn = signal(false);
  protected readonly dialogOpen = signal(false);

  /** Autoplay choreography — loops forever until the visitor takes over. */
  private readonly _script: TheaterStep[] = [
    { key: 'Tab', target: 0 },
    { key: '→', target: 1 },
    { key: '→', target: 2 },
    { key: 'End', target: 3 },
    { key: 'Home', target: 0 },
    { key: '→', target: 1 },
    { key: 'Tab', target: 4 },
    { key: 'Space', target: 4, toggles: true },
    { key: 'Space', target: 4, toggles: true },
  ];

  private _stepIndex = 0;
  private _stepTimer: ReturnType<typeof setInterval> | null = null;
  private _keyTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }
      this._startAutoplay();
    });

    destroyRef.onDestroy(() => this._stopAutoplay());
  }

  protected currentTargetLabel(): string {
    return this.simIndex() === 4 ? 'Notifications' : (this.items[this.simIndex()] ?? '');
  }

  protected announce(): void {
    this._toastCreator.show({
      header: 'Changes saved',
      content: 'Announced through the library’s built-in live region.',
    });
  }

  private _startAutoplay(): void {
    if (this._stepTimer !== null) {
      return;
    }
    this._stepTimer = setInterval(() => this._playStep(), 1100);
  }

  private _stopAutoplay(): void {
    if (this._stepTimer !== null) {
      clearInterval(this._stepTimer);
      this._stepTimer = null;
    }
    if (this._keyTimer !== null) {
      clearTimeout(this._keyTimer);
      this._keyTimer = null;
    }
    this.pressedKey.set(null);
  }

  private _playStep(): void {
    const step = this._script[this._stepIndex];
    if (!step) {
      this._stepIndex = 0;
      return;
    }
    this._stepIndex = (this._stepIndex + 1) % this._script.length;

    this.pressedKey.set(step.key);
    this.simIndex.set(step.target);
    if (step.toggles) {
      this.switchOn.update(v => !v);
    }

    if (this._keyTimer !== null) {
      clearTimeout(this._keyTimer);
    }
    this._keyTimer = setTimeout(() => this.pressedKey.set(null), 400);
  }
}
