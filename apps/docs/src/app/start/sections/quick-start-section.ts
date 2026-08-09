import { Component, signal } from '@angular/core';
import { JigSlider } from '@awdlab/jig/slider';
import { JigSwitch } from '@awdlab/jig/switch';

import { JigDocsReveal } from './reveal';
import { JigDocsSectionHeader } from './section-header';
import { style } from '../../utils/code/prism';

const EXAMPLE_CODE = `import { Component, signal } from '@angular/core';
import { JigSlider } from '@awdlab/jig/slider';
import { JigSwitch } from '@awdlab/jig/switch';

@Component({
  selector: 'app-volume',
  imports: [JigSlider, JigSwitch],
  template: \`
    <jig-slider [min]="0" [max]="100" [(value)]="volume" />
    <jig-switch [(value)]="muted" />
  \`,
})
export class VolumeComponent {
  protected readonly volume = signal(57);
  protected readonly muted = signal(true);
}`;

@Component({
  selector: 'jig-docs-quick-start-section',
  imports: [JigSlider, JigSwitch, JigDocsReveal, JigDocsSectionHeader],
  host: { class: 'block px-(--jig-size-padding-xl) py-12 lg:py-16' },
  template: `
    <div [ngnDocsReveal]="0" class="mx-auto max-w-[1100px]">
      <jig-docs-section-header
        class="mb-8 lg:mb-12"
        eyebrow="Quick start"
        heading="So simple to use"
        subtitle="Import a control, bind your signal, ship. No boilerplate, no ceremony."
      />

      <div
        class="overflow-hidden rounded-(--jig-size-rounded-lg) border border-(--jig-color-surface-200) bg-(--jig-color-surface-25)"
      >
        <div class="grid grid-cols-1 lg:grid-cols-2">
          <div
            class="border-b border-(--jig-color-surface-200) p-(--jig-size-padding-xl) lg:border-r lg:border-b-0"
          >
            <p
              class="mono mb-(--jig-size-padding-lg) text-(length:--jig-font-size-sm) text-(--jig-color-surface-500)"
            >
              volume.component.ts
            </p>
            <pre
              class="overflow-x-auto text-(length:--jig-font-size-sm)"
            ><code class="prism" [innerHTML]="highlighted()"></code></pre>
          </div>

          <div
            class="flex flex-col justify-center gap-(--jig-size-padding-lg) bg-[color-mix(in_srgb,var(--jig-color-primary-500)_5%,transparent)] p-(--jig-size-padding-xl)"
          >
            <div class="mono flex items-center justify-between">
              <span class="text-(length:--jig-font-size-sm) text-(--jig-color-surface-500)">
                running here, zoneless
              </span>
              <span
                class="flex items-center gap-(--jig-size-padding-sm) text-(length:--jig-font-size-sm) text-(--jig-color-success-600)"
              >
                <span class="size-1.5 rounded-full bg-(--jig-color-success-500)"></span>
                live
              </span>
            </div>

            <div>
              <div class="mb-(--jig-size-padding-md) flex items-baseline justify-between">
                <label [for]="volumeSlider.inputId()" class="text-(--jig-color-text)">Volume</label>
                <span
                  class="text-(length:--jig-font-size-lg) font-(--jig-font-weight-bold) text-(--jig-color-text)"
                >
                  {{ volume() }}
                </span>
              </div>
              <jig-slider #volumeSlider [min]="0" [max]="100" [(value)]="volume" />
            </div>

            <div class="flex items-center justify-between">
              <label [for]="mutedSwitch.inputId()" class="text-(--jig-color-text)">Muted</label>
              <jig-switch #mutedSwitch [(value)]="muted" />
            </div>

            <p
              class="border-t border-(--jig-color-surface-200) pt-(--jig-size-padding-lg) text-(length:--jig-font-size-sm) text-(--jig-color-surface-600)"
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
export class JigDocsQuickStartSection {
  protected readonly volume = signal(57);
  protected readonly muted = signal(true);
  protected readonly highlighted = signal('');

  constructor() {
    void style(EXAMPLE_CODE).then(html => this.highlighted.set(html));
  }
}
