import { Component, DestroyRef, afterNextRender, computed, inject, signal } from '@angular/core';
import { NgnRovingGroup, NgnRovingItem } from '@ngneers/controls/roving-focus';
import { NgnSwitch } from '@ngneers/controls/switch';

import { NgnDocsReveal } from './reveal';
import { NgnDocsSectionHeader } from './section-header';

/** One beat of the autoplay script: which keycap flashes and where the ring lands. */
interface TheaterStep {
  key: string;
  /** 0–3 = toolbar buttons, 4 = the switch. */
  target: number;
  /** Toggle the switch on this beat. */
  toggles?: boolean;
}

const ITEMS = ['Home', 'Search', 'Profile', 'Settings'];

/** What every control ships with, no wiring on your side. */
const GUARANTEES: readonly { label: string; body: string }[] = [
  {
    label: 'roving tabindex',
    body: 'Groups are one tab stop; arrows, Home and End move inside them.',
  },
  {
    label: 'focus return',
    body: 'Dialogs trap focus while open and hand it back to the trigger on close.',
  },
  {
    label: 'aria state',
    body: 'Checked, expanded, selected and disabled land on the real element, not a wrapper.',
  },
  {
    label: 'axe in CI',
    body: 'Every control is asserted against axe on every release, not audited once.',
  },
];

@Component({
  selector: 'ngn-docs-accessibility-section',
  imports: [NgnRovingGroup, NgnRovingItem, NgnSwitch, NgnDocsReveal, NgnDocsSectionHeader],
  host: { class: 'block px-(--ngn-size-padding-xl) py-12 lg:py-16' },
  template: `
    <div class="mx-auto max-w-[1100px]">
      <ngn-docs-section-header
        [ngnDocsReveal]="0"
        class="mb-8 lg:mb-12"
        eyebrow="Accessibility"
        heading="Drive it with the keyboard"
        subtitle="Focus management, roving tabindex, ARIA state and live-region announcements ship with every control. The stage below is real library code, driven by the same key handling your users get."
      />

      <div
        [ngnDocsReveal]="60"
        class="overflow-hidden rounded-(--ngn-size-rounded-lg) border border-(--ngn-color-surface-200) bg-(--ngn-color-surface-25)"
      >
        <div class="grid grid-cols-1 lg:grid-cols-2">
          <div
            class="flex flex-col gap-(--ngn-size-padding-xl) border-b border-(--ngn-color-surface-200) p-(--ngn-size-padding-xl) lg:border-r lg:border-b-0"
          >
            <div>
              <p
                class="mono mb-(--ngn-size-padding-md) text-(length:--ngn-font-size-sm) text-(--ngn-color-surface-500)"
              >
                keys the demo is pressing
              </p>
              <div class="flex flex-wrap gap-(--ngn-size-padding-sm)">
                @for (key of keys; track key) {
                  <span class="ngn-keycap" [class.ngn-keycap-pressed]="pressedKey() === key">
                    {{ key }}
                  </span>
                }
              </div>
            </div>

            <dl class="flex flex-col gap-(--ngn-size-padding-lg)">
              @for (guarantee of guarantees; track guarantee.label) {
                <div>
                  <dt class="mono text-(length:--ngn-font-size-sm) text-(--ngn-color-primary-500)">
                    {{ guarantee.label }}
                  </dt>
                  <dd class="text-(length:--ngn-font-size-sm) text-(--ngn-color-surface-600)">
                    {{ guarantee.body }}
                  </dd>
                </div>
              }
            </dl>
          </div>

          <div
            class="flex flex-col justify-center gap-(--ngn-size-padding-lg) bg-[color-mix(in_srgb,var(--ngn-color-primary-500)_5%,transparent)] p-(--ngn-size-padding-xl)"
          >
            <!-- Watch-only stage: inert so real focus never lands here — the real
               focus styles differ from the simulated ring and would confuse. -->
            <div
              inert
              class="pointer-events-none flex flex-col gap-(--ngn-size-padding-lg) select-none"
            >
              <p class="mono text-(length:--ngn-font-size-sm) text-(--ngn-color-surface-500)">
                toolbar — one tab stop, arrows inside
              </p>
              <div
                ngnRovingGroup
                orientation="horizontal"
                rovingMode="tabindex"
                [rovingWrap]="true"
                role="toolbar"
                aria-label="Keyboard navigation demo"
                class="flex flex-wrap gap-(--ngn-size-padding-md) rounded-(--ngn-size-rounded-md) border border-(--ngn-color-surface-200) bg-(--ngn-color-background) p-(--ngn-size-padding-md)"
              >
                @for (item of items; track item; let i = $index) {
                  <button
                    ngnRovingItem
                    type="button"
                    class="rounded-(--ngn-size-rounded-md) px-(--ngn-size-padding-lg) py-(--ngn-size-padding-md) text-(--ngn-color-text)"
                    [class.ngn-sim-focus]="simIndex() === i"
                  >
                    {{ item }}
                  </button>
                }
              </div>
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

            <!-- Mirrors what a screen reader would say; hidden from assistive tech
               so the autoplay loop never announces over the real page. -->
            <div
              aria-hidden="true"
              class="flex items-center gap-(--ngn-size-padding-md) rounded-r-(--ngn-size-rounded-md) border-l-3 border-(--ngn-color-success-500) bg-[color-mix(in_srgb,var(--ngn-color-success-500)_8%,transparent)] px-(--ngn-size-padding-lg) py-(--ngn-size-padding-md)"
            >
              <span class="mono text-(length:--ngn-font-size-sm) text-(--ngn-color-success-600)">
                aria-live
              </span>
              <span class="text-(length:--ngn-font-size-sm) text-(--ngn-color-text)">
                {{ announcement() }}
              </span>
            </div>

            <dl
              aria-hidden="true"
              class="mono grid grid-cols-[auto_1fr] gap-x-(--ngn-size-padding-lg) gap-y-(--ngn-size-padding-xs) border-t border-(--ngn-color-surface-200) pt-(--ngn-size-padding-lg) text-(length:--ngn-font-size-sm) text-(--ngn-color-surface-500)"
            >
              <dt>focused</dt>
              <dd class="text-(--ngn-color-text)">{{ focusedLabel() }} ({{ role() }})</dd>
              <dt>{{ onSwitch() ? 'aria-checked' : 'tabindex' }}</dt>
              <dd class="text-(--ngn-color-text)">
                {{ onSwitch() ? switchOn() : '0 — single tab stop' }}
              </dd>
              <dt>tested</dt>
              <dd class="text-(--ngn-color-text)">axe · Playwright · CI</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class NgnDocsAccessibilitySection {
  protected readonly items = ITEMS;
  protected readonly guarantees = GUARANTEES;
  protected readonly keys = ['Tab', '←', '→', 'Home', 'End', 'Space'];

  protected readonly pressedKey = signal<string | null>(null);
  protected readonly simIndex = signal(0);
  protected readonly switchOn = signal(false);

  protected readonly onSwitch = computed(() => this.simIndex() === 4);

  protected readonly focusedLabel = computed(() =>
    this.onSwitch() ? 'Notifications' : (ITEMS[this.simIndex()] ?? '')
  );

  protected readonly role = computed(() => (this.onSwitch() ? 'switch' : 'button'));

  /** What a screen reader reads out for wherever the ring currently sits. */
  protected readonly announcement = computed(() =>
    this.onSwitch()
      ? `Notifications, switch, ${this.switchOn() ? 'on' : 'off'}`
      : `${this.focusedLabel()}, button, ${this.simIndex() + 1} of ${ITEMS.length}`
  );

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
