import { Component, computed, input } from '@angular/core';

import { JigDocsReveal } from './reveal';
import { JigDocsSectionHeader } from './section-header';

export type SectionLayout = 'split-left' | 'split-right' | 'full';

@Component({
  selector: 'jig-docs-section-shell',
  imports: [JigDocsReveal, JigDocsSectionHeader],
  host: { class: 'block px-(--jig-size-padding-xl) py-12 lg:py-16' },
  template: `
    <div class="mx-auto max-w-[1100px]">
      <jig-docs-section-header
        [ngnDocsReveal]="0"
        class="mb-8 lg:mb-12"
        [eyebrow]="eyebrow()"
        [heading]="heading()"
        [subtitle]="subtitle()"
      />

      <!-- Order via inline style (not a dynamic class) so it survives JIT. -->
      @if (isSplit()) {
        <div
          [ngnDocsReveal]="60"
          class="grid grid-cols-1 items-center gap-(--jig-size-padding-xl) lg:grid-cols-2"
        >
          <div [style.order]="layout() === 'split-right' ? 2 : 1">
            <ng-content select="[primary]" />
          </div>
          <div [style.order]="layout() === 'split-right' ? 1 : 2">
            <ng-content select="[secondary]" />
          </div>
        </div>
      } @else {
        <div [ngnDocsReveal]="60">
          <ng-content />
        </div>
      }
    </div>
  `,
})
export class JigDocsSectionShell {
  public readonly eyebrow = input.required<string>();
  public readonly heading = input.required<string>();
  public readonly subtitle = input<string>('');
  public readonly layout = input<SectionLayout>('full');

  protected readonly isSplit = computed(
    () => this.layout() === 'split-left' || this.layout() === 'split-right'
  );
}
