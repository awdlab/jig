import { Component, signal } from '@angular/core';
import { NgnSlider } from '@ngneers/controls/slider';

import { NgnDocsSectionShell } from './section-shell';
import { style } from '../../utils/code/prism';

const EXAMPLE_CODE = `import { Component, signal } from '@angular/core';
import { NgnSlider } from '@ngneers/controls/slider';

@Component({
  selector: 'app-volume',
  imports: [NgnSlider],
  template: \`
    <ngn-slider [min]="0" [max]="100" [(value)]="volume" />
    <p>volume = {{ volume() }}</p>
  \`,
})
export class VolumeComponent {
  protected readonly volume = signal(50);
}`;

@Component({
  selector: 'ngn-docs-quick-start-section',
  imports: [NgnDocsSectionShell, NgnSlider],
  template: `
    <ngn-docs-section-shell
      layout="split-left"
      eyebrow="Quick start"
      heading="So simple to use"
      subtitle="Import a control, bind your signal, ship. No boilerplate, no ceremony."
    >
      <div primary>
        <div
          class="mb-(--ngn-size-padding-lg) rounded-lg bg-(--ngn-color-surface-800) p-(--ngn-size-padding-lg) font-mono text-(length:--ngn-font-size-sm) text-(--ngn-color-surface-50)"
        >
          <span class="text-(--ngn-color-surface-400)">$</span> pnpm add &#64;ngneers/controls
        </div>
        <pre
          class="overflow-x-auto rounded-lg p-(--ngn-size-padding-lg) text-(length:--ngn-font-size-sm)"
        ><code class="prism" [innerHTML]="highlighted()"></code></pre>
      </div>
      <div secondary class="card p-(--ngn-size-padding-xl)">
        <ngn-slider [min]="0" [max]="100" [(value)]="volume" />
        <p
          class="mt-(--ngn-size-padding-lg) text-(length:--ngn-font-size-lg) text-(--ngn-color-text)"
        >
          volume = <strong>{{ volume() }}</strong>
        </p>
      </div>
    </ngn-docs-section-shell>
  `,
})
export class NgnDocsQuickStartSection {
  protected readonly volume = signal(50);
  protected readonly highlighted = signal('');

  constructor() {
    style(EXAMPLE_CODE).then(html => this.highlighted.set(html));
  }
}
