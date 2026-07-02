import { Component, inject } from '@angular/core';
import { ColorSchemeService } from '@ngneers/controls/api/ng';
import { NgnButton } from '@ngneers/controls/button';
import { NgnSwitch } from '@ngneers/controls/switch';

import { NgnDocsSectionShell } from './section-shell';
import { NgnDocsThemePicker } from '../../utils/theme-picker';

@Component({
  selector: 'ngn-docs-theming-section',
  imports: [NgnDocsSectionShell, NgnDocsThemePicker, NgnSwitch, NgnButton],
  template: `
    <ngn-docs-section-shell
      layout="centered"
      eyebrow="Theming"
      heading="Your design system"
      subtitle="Every color, space, and font is a design token. Pick a theme and a color — the whole page follows."
    >
      <div class="mx-auto flex max-w-[520px] flex-col items-center gap-(--ngn-size-padding-xl)">
        <div class="flex items-center gap-(--ngn-size-padding-md)">
          <ngn-switch
            #darkSwitch
            [value]="colorScheme.isDark()"
            (valueChange)="colorScheme.set($event ? 'dark' : 'light')"
          />
          <label [for]="darkSwitch.inputId()" class="text-(--ngn-color-text)"
            >Dark mode (flips the whole page)</label
          >
        </div>

        <ngn-docs-theme-picker />

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
            <code>--ngn-color-*</code> tokens — switch the theme or color and watch them adapt.
          </p>
          <button ngnButton kind="primary">Themed button</button>
        </div>
      </div>
    </ngn-docs-section-shell>
  `,
})
export class NgnDocsThemingSection {
  protected readonly colorScheme = inject(ColorSchemeService);
}
