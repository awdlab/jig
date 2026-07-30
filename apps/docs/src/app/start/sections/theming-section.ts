import { Component, ElementRef, afterRenderEffect, inject, signal } from '@angular/core';
import { ColorSchemeService } from '@ngneers/controls/api/ng';
import { NgnButton } from '@ngneers/controls/button';
import { NgnProgress } from '@ngneers/controls/progress';
import { NgnSwitch } from '@ngneers/controls/switch';

import { NgnDocsSectionShell } from './section-shell';
import { NgnDocsThemePicker, ThemePickerService } from '../../utils/theme-picker';

/** Size tokens echoed under the picker; the primary color is read off the swatch below. */
const READOUT_SIZE_TOKENS = ['--ngn-size-rounded-md', '--ngn-size-padding-md'] as const;

/** Opaque computed colors serialize as `color(srgb 0..1 …)` or `rgb(0..255 …)` — show hex instead. */
function toHex(color: string): string {
  const parts = color
    .match(/[\d.]+/g)
    ?.slice(0, 3)
    .map(Number);
  if (!parts || parts.length < 3) {
    return color;
  }
  const scale = color.startsWith('color(') ? 255 : 1;
  return `#${parts
    .map(p =>
      Math.round(p * scale)
        .toString(16)
        .padStart(2, '0')
    )
    .join('')}`;
}

@Component({
  selector: 'ngn-docs-theming-section',
  imports: [NgnDocsSectionShell, NgnDocsThemePicker, NgnSwitch, NgnButton, NgnProgress],
  template: `
    <ngn-docs-section-shell
      layout="split-left"
      eyebrow="Theming"
      heading="Your design system, not ours"
      subtitle="Every color, space and radius is a design token. Pick a theme and a color — every control follows."
    >
      <div primary>
        <div class="mb-(--ngn-size-padding-xl) flex items-center gap-(--ngn-size-padding-md)">
          <ngn-switch
            #darkSwitch
            [value]="colorScheme.isDark()"
            (valueChange)="colorScheme.set($event ? 'dark' : 'light')"
          />
          <label [for]="darkSwitch.inputId()" class="text-(--ngn-color-text)">Dark mode</label>
        </div>

        <ngn-docs-theme-picker />

        <div
          class="mono mt-(--ngn-size-padding-xl) border-t border-(--ngn-color-surface-200) pt-(--ngn-size-padding-lg) text-(length:--ngn-font-size-sm) leading-relaxed text-(--ngn-color-surface-700)"
        >
          @for (token of tokens(); track token.name) {
            <div class="overflow-x-auto whitespace-nowrap">
              <span class="token-name text-(--ngn-color-primary-500)">{{ token.name }}</span
              >: {{ token.value }};
            </div>
          }
        </div>
      </div>

      <div secondary class="card p-(--ngn-size-padding-xl)">
        <p
          class="mono mb-(--ngn-size-padding-lg) text-(length:--ngn-font-size-sm) text-(--ngn-color-surface-500)"
        >
          live preview · {{ picker.activeOption().label }}
        </p>
        <h3
          class="mb-(--ngn-size-padding-sm) text-(length:--ngn-font-size-lg) font-(--ngn-font-weight-bold) text-(--ngn-color-text)"
        >
          Token-driven surface
        </h3>
        <p
          class="mb-(--ngn-size-padding-lg) text-(length:--ngn-font-size-md) text-(--ngn-color-surface-600)"
        >
          This card, its controls and the buttons below all read from the same token layer.
        </p>
        <div class="mb-(--ngn-size-padding-lg) flex items-center justify-between">
          <label [for]="notifySwitch.inputId()" class="text-(--ngn-color-text)">
            Notifications
          </label>
          <ngn-switch #notifySwitch [(value)]="notify" />
        </div>
        <ngn-progress class="mb-(--ngn-size-padding-xl) block" [value]="64" />
        <div class="flex flex-wrap gap-(--ngn-size-padding-md)">
          <button ngnButton kind="primary">Themed button</button>
          <button ngnButton kind="secondary">Secondary</button>
        </div>
      </div>
    </ngn-docs-section-shell>
  `,
})
export class NgnDocsThemingSection {
  protected readonly colorScheme = inject(ColorSchemeService);
  protected readonly picker = inject(ThemePickerService);

  protected readonly notify = signal(true);

  protected readonly tokens = signal<readonly { name: string; value: string }[]>([
    { name: '--ngn-color-primary-500', value: '…' },
    ...READOUT_SIZE_TOKENS.map(name => ({ name, value: '…' })),
  ]);

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    // Computed values only exist in the browser, so re-read them after render
    // whenever the selection changes.
    afterRenderEffect(() => {
      this.picker.themeId();
      this.picker.selectedColor();
      this.picker.selectedSurface();
      this.colorScheme.isDark();
      const styles = getComputedStyle(host);
      // The custom property holds an unresolved `hsl(from …)`, so take the color
      // from an element that actually consumes it.
      const swatch = host.querySelector('.token-name');
      this.tokens.set([
        {
          name: '--ngn-color-primary-500',
          value: swatch ? toHex(getComputedStyle(swatch).color) : '…',
        },
        ...READOUT_SIZE_TOKENS.map(name => ({
          name,
          value: styles.getPropertyValue(name).trim(),
        })),
      ]);
    });
  }
}
