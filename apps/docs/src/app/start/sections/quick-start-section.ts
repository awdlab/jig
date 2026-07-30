import { Component, signal } from '@angular/core';
import { NgnSlider } from '@ngneers/controls/slider';
import { NgnSwitch } from '@ngneers/controls/switch';

import { NgnDocsReveal } from './reveal';
import { NgnDocsSectionHeader } from './section-header';
import { style } from '../../utils/code/prism';

const EXAMPLE_CODE = `import { Component, signal } from '@angular/core';
import { NgnSlider } from '@ngneers/controls/slider';
import { NgnSwitch } from '@ngneers/controls/switch';

@Component({
  selector: 'app-volume',
  imports: [NgnSlider, NgnSwitch],
  template: \`
    <ngn-slider [min]="0" [max]="100" [(value)]="volume" />
    <ngn-switch [(value)]="muted" />
  \`,
})
export class VolumeComponent {
  protected readonly volume = signal(57);
  protected readonly muted = signal(true);
}`;

@Component({
  selector: 'ngn-docs-quick-start-section',
  imports: [NgnSlider, NgnSwitch, NgnDocsReveal, NgnDocsSectionHeader],
  host: { class: 'block px-(--ngn-size-padding-xl) py-12 lg:py-16' },
  template: `
    <div [ngnDocsReveal]="0" class="mx-auto max-w-[1100px]">
      <ngn-docs-section-header
        class="mb-8 lg:mb-12"
        eyebrow="Quick start"
        heading="So simple to use"
        subtitle="Import a control, bind your signal, ship. No boilerplate, no ceremony."
      />

      <div
        class="overflow-hidden rounded-(--ngn-size-rounded-lg) border border-(--ngn-color-surface-200) bg-(--ngn-color-surface-25)"
      >
        <div class="grid grid-cols-1 lg:grid-cols-2">
          <div
            class="border-b border-(--ngn-color-surface-200) p-(--ngn-size-padding-xl) lg:border-r lg:border-b-0"
          >
            <p
              class="mono mb-(--ngn-size-padding-lg) text-(length:--ngn-font-size-sm) text-(--ngn-color-surface-500)"
            >
              volume.component.ts
            </p>
            <pre
              class="overflow-x-auto text-(length:--ngn-font-size-sm)"
            ><code class="prism" [innerHTML]="highlighted()"></code></pre>
          </div>

          <div
            class="flex flex-col justify-center gap-(--ngn-size-padding-lg) bg-[color-mix(in_srgb,var(--ngn-color-primary-500)_5%,transparent)] p-(--ngn-size-padding-xl)"
          >
            <div class="mono flex items-center justify-between">
              <span class="text-(length:--ngn-font-size-sm) text-(--ngn-color-surface-500)">
                running here, zoneless
              </span>
              <span
                class="flex items-center gap-(--ngn-size-padding-sm) text-(length:--ngn-font-size-sm) text-(--ngn-color-success-600)"
              >
                <span class="size-1.5 rounded-full bg-(--ngn-color-success-500)"></span>
                live
              </span>
            </div>

            <div>
              <div class="mb-(--ngn-size-padding-md) flex items-baseline justify-between">
                <label [for]="volumeSlider.inputId()" class="text-(--ngn-color-text)">Volume</label>
                <span
                  class="text-(length:--ngn-font-size-lg) font-(--ngn-font-weight-bold) text-(--ngn-color-text)"
                >
                  {{ volume() }}
                </span>
              </div>
              <ngn-slider #volumeSlider [min]="0" [max]="100" [(value)]="volume" />
            </div>

            <div class="flex items-center justify-between">
              <label [for]="mutedSwitch.inputId()" class="text-(--ngn-color-text)">Muted</label>
              <ngn-switch #mutedSwitch [(value)]="muted" />
            </div>

            <p
              class="border-t border-(--ngn-color-surface-200) pt-(--ngn-size-padding-lg) text-(length:--ngn-font-size-sm) text-(--ngn-color-surface-600)"
            >
              No <code>ngModel</code>, no subscriptions, no change-detection calls — the signal
              <em>is</em> the binding.
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class NgnDocsQuickStartSection {
  protected readonly volume = signal(57);
  protected readonly muted = signal(true);
  protected readonly highlighted = signal('');

  constructor() {
    void style(EXAMPLE_CODE).then(html => this.highlighted.set(html));
  }
}
