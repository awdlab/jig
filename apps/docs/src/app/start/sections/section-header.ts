import { Component, input } from '@angular/core';

/** The one header pattern every start-page segment uses: keyword, heading, subheader. */
@Component({
  selector: 'ngn-docs-section-header',
  host: { class: 'block text-left' },
  template: `
    <p
      class="mono text-(length:--ngn-font-size-sm) tracking-wider text-(--ngn-color-primary-500) uppercase"
    >
      {{ eyebrow() }}
    </p>
    <h2
      class="mt-1 mb-(--ngn-size-padding-md) text-[2.25rem] leading-tight font-(--ngn-font-weight-bold) text-(--ngn-color-text) lg:text-[2.75rem]"
    >
      {{ heading() }}
    </h2>
    @if (subtitle()) {
      <p class="max-w-[70ch] text-(length:--ngn-font-size-md) text-(--ngn-color-surface-600)">
        {{ subtitle() }}
      </p>
    }
  `,
})
export class NgnDocsSectionHeader {
  public readonly eyebrow = input.required<string>();
  public readonly heading = input.required<string>();
  public readonly subtitle = input<string>('');
}
