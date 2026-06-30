import { Component, DestroyRef, DOCUMENT, effect, inject, signal } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';
import { NgnSwitch } from '@ngneers/controls/switch';

import { NgnDocsSectionShell } from './section-shell';
import { FrameState } from '../../frame/frame-state';

// Nova primary shade levels, in the order it emits `--ngn-color-primary-<level>`.
const PRIMARY_LEVELS = [25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 975] as const;

const DEFAULT_PRIMARY = '#4557ba'; // Nova's `inkColor`

const PRESETS: readonly { name: string; hex: string }[] = [
  { name: 'Ink (default)', hex: DEFAULT_PRIMARY },
  { name: 'Sky', hex: '#0da6f2' },
  { name: 'Teal', hex: '#14b8a6' },
  { name: 'Rose', hex: '#f43f5e' },
  { name: 'Amber', hex: '#f59e0b' },
];

// Replicates Nova's `getColorShade`: lightness = (1000 - level) / 10, hue/sat from base.
function lightShade(baseColor: string, level: number): string {
  return `hsl(from ${baseColor} h s ${(1000 - level) / 10})`;
}

// Nova reverses the palette under `.dark`, so dark level `i` = light value of the mirrored level.
function darkShade(baseColor: string, index: number): string {
  const mirrored = PRIMARY_LEVELS[PRIMARY_LEVELS.length - 1 - index]!;
  return lightShade(baseColor, mirrored);
}

@Component({
  selector: 'ngn-docs-theming-section',
  imports: [NgnDocsSectionShell, NgnSwitch, NgnButton],
  template: `
    <ngn-docs-section-shell
      layout="centered"
      eyebrow="Theming"
      heading="Your design system"
      subtitle="Every color, space, and font is a design token. Base and Nova themes today — more soon."
    >
      <div class="mx-auto flex max-w-[520px] flex-col items-center gap-(--ngn-size-padding-xl)">
        <div class="flex items-center gap-(--ngn-size-padding-md)">
          <ngn-switch #darkSwitch [(value)]="darkMode" />
          <label [for]="darkSwitch.inputId()" class="text-(--ngn-color-text)"
            >Dark mode (flips the whole page)</label
          >
        </div>

        <div class="flex w-full flex-col items-center gap-(--ngn-size-padding-md)">
          <div class="flex items-center gap-(--ngn-size-padding-md)">
            <input
              id="primary-color-input"
              type="color"
              class="h-8 w-12 cursor-pointer rounded border border-(--ngn-color-border) bg-transparent"
              [value]="primaryColor()"
              (input)="onPick($event)"
            />
            <label for="primary-color-input" class="text-(--ngn-color-text)"
              >Primary color (reskins the whole page)</label
            >
          </div>

          <div class="flex flex-wrap items-center justify-center gap-(--ngn-size-padding-sm)">
            @for (preset of presets; track preset.hex) {
              <button
                type="button"
                class="h-7 w-7 cursor-pointer rounded-full border border-(--ngn-color-border) transition-transform hover:scale-110"
                [style.background-color]="preset.hex"
                [attr.aria-label]="'Use ' + preset.name"
                [attr.title]="preset.name"
                (click)="applyColor(preset.hex)"
              ></button>
            }
            <button ngnButton kind="secondary" (click)="reset()">Reset</button>
          </div>
        </div>

        <div class="card w-full p-(--ngn-size-padding-xl) text-left">
          <p
            class="mb-(--ngn-size-padding-sm) text-(length:--ngn-font-size-sm) font-(--ngn-font-weight-semibold) tracking-wide text-(--ngn-color-primary-500) uppercase"
          >
            Live preview
          </p>
          <h3
            class="mb-(--ngn-size-padding-sm) text-(length:--ngn-font-size-lg) font-(--ngn-font-weight-bold) text-(--ngn-color-text)"
          >
            Token-driven surface
          </h3>
          <p
            class="mb-(--ngn-size-padding-lg) text-(length:--ngn-font-size-md) text-(--ngn-color-surface-600)"
          >
            This card, its text, and the button below all read from
            <code>--ngn-color-*</code> tokens — flip the switch and watch them adapt.
          </p>
          <button ngnButton kind="primary">Themed button</button>
        </div>
      </div>
    </ngn-docs-section-shell>
  `,
})
export class NgnDocsThemingSection {
  private readonly _frame = inject(FrameState);
  private readonly _document = inject(DOCUMENT);

  // Shared with the topbar toggle; flipping it toggles `.dark` on <html>.
  protected readonly darkMode = this._frame.darkMode;

  protected readonly presets = PRESETS;

  protected readonly primaryColor = signal(DEFAULT_PRIMARY);

  private _styleEl: HTMLStyleElement | null = null;

  // The color input fires rapidly while dragging and each apply rebuilds the
  // override <style>, so throttle to one rebuild per window (leading + trailing).
  private static readonly _THROTTLE_MS = 70;
  private _throttleTimer: ReturnType<typeof setTimeout> | null = null;
  private _pendingHex: string | null = null;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      if (this._throttleTimer !== null) {
        clearTimeout(this._throttleTimer);
        this._throttleTimer = null;
      }
      this._pendingHex = null;
      this._styleEl?.remove();
      this._styleEl = null;
    });

    effect(() => {
      const base = this.primaryColor();
      if (base === DEFAULT_PRIMARY) {
        // Drop the override so the theme's own ramp applies.
        if (this._styleEl) {
          this._styleEl.textContent = '';
        }
        return;
      }
      this._writeOverride(base);
    });
  }

  // Throttled: apply on the leading edge, stash later values, flush on trailing.
  protected onPick(event: Event): void {
    const hex = (event.target as HTMLInputElement).value;

    if (this._throttleTimer !== null) {
      this._pendingHex = hex;
      return;
    }

    this.applyColor(hex);
    this._pendingHex = null;
    this._throttleTimer = setTimeout(() => {
      this._throttleTimer = null;
      if (this._pendingHex !== null) {
        const pending = this._pendingHex;
        this._pendingHex = null;
        this.applyColor(pending);
      }
    }, NgnDocsThemingSection._THROTTLE_MS);
  }

  protected applyColor(hex: string): void {
    // Supersede any stashed drag value so it can't flush over this pick.
    this._cancelThrottle();
    this.primaryColor.set(hex);
  }

  protected reset(): void {
    this._cancelThrottle();
    this.primaryColor.set(DEFAULT_PRIMARY);
  }

  private _cancelThrottle(): void {
    if (this._throttleTimer !== null) {
      clearTimeout(this._throttleTimer);
      this._throttleTimer = null;
    }
    this._pendingHex = null;
  }

  private _ensureStyleEl(): HTMLStyleElement {
    if (!this._styleEl) {
      const el = this._document.createElement('style');
      el.id = 'ngn-primary-override';
      // Appended last → wins over the theme's :root / .dark rules at equal specificity.
      this._document.head.appendChild(el);
      this._styleEl = el;
    }
    return this._styleEl;
  }

  private _writeOverride(base: string): void {
    const lightVars = PRIMARY_LEVELS.map(
      level => `--ngn-color-primary-${level}: ${lightShade(base, level)};`
    ).join('\n  ');

    const darkVars = PRIMARY_LEVELS.map(
      (level, index) => `--ngn-color-primary-${level}: ${darkShade(base, index)};`
    ).join('\n  ');

    this._ensureStyleEl().textContent = `:root {
  ${lightVars}
}
html.dark {
  ${darkVars}
}`;
  }
}
