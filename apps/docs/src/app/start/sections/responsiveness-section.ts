import { Component, computed, signal } from '@angular/core';
import { type BreadcrumbItem, NgnBreadcrumb } from '@ngneers/controls/breadcrumb';
import { NgnInputField } from '@ngneers/controls/input-field';
import { NgnSelect } from '@ngneers/controls/select';
import { NgnSlider } from '@ngneers/controls/slider';
import { NgnTab, NgnTabs } from '@ngneers/controls/tabs';

import { NgnDocsSectionShell } from './section-shell';

@Component({
  selector: 'ngn-docs-responsiveness-section',
  imports: [
    NgnDocsSectionShell,
    NgnSlider,
    NgnSelect,
    NgnInputField,
    NgnBreadcrumb,
    NgnTabs,
    NgnTab,
  ],
  template: `
    <ngn-docs-section-shell
      layout="full"
      eyebrow="Responsiveness"
      heading="Adapts to any space"
      subtitle="Controls handle overflow natively — chips collapse, breadcrumbs fold into a menu, and tabs gain scroll controls as the available width shrinks. No media queries required."
    >
      <div class="flex flex-col gap-(--ngn-size-padding-xl) text-left">
        <div class="flex items-center gap-(--ngn-size-padding-lg)">
          <span
            id="container-width-label"
            class="shrink-0 text-(length:--ngn-font-size-sm) font-(--ngn-font-weight-semibold) text-(--ngn-color-text)"
          >
            Container width
          </span>
          <ngn-slider
            [min]="30"
            [max]="100"
            [step]="5"
            [(value)]="widthPct"
            labelledBy="container-width-label"
            class="flex-1"
          />
          <span
            class="w-12 shrink-0 text-right font-mono text-(length:--ngn-font-size-sm) font-(--ngn-font-weight-semibold) text-(--ngn-color-primary-500)"
          >
            {{ widthPct() }}%
          </span>
        </div>

        <div
          class="card overflow-hidden p-(--ngn-size-padding-xl)"
          [style.width.%]="widthPct()"
          [style.max-width]="'100%'"
        >
          <div class="flex flex-col gap-(--ngn-size-padding-xl)">
            <div>
              <p
                id="responsiveness-multiselect-label"
                class="mb-(--ngn-size-padding-sm) text-(length:--ngn-font-size-xs) font-(--ngn-font-weight-semibold) tracking-wide text-(--ngn-color-surface-500) uppercase"
              >
                Multiselect
              </p>
              <ngn-input-field>
                <ngn-select
                  [multiple]="true"
                  [options]="options"
                  [(value)]="selected"
                  labelledBy="responsiveness-multiselect-label"
                />
              </ngn-input-field>
            </div>

            <div>
              <p
                class="mb-(--ngn-size-padding-sm) text-(length:--ngn-font-size-xs) font-(--ngn-font-weight-semibold) tracking-wide text-(--ngn-color-surface-500) uppercase"
              >
                Breadcrumb
              </p>
              <ngn-breadcrumb [items]="crumbs" />
            </div>

            <div>
              <p
                class="mb-(--ngn-size-padding-sm) text-(length:--ngn-font-size-xs) font-(--ngn-font-weight-semibold) tracking-wide text-(--ngn-color-surface-500) uppercase"
              >
                Tabs
              </p>
              @if (tabs().length) {
                <ngn-tabs>
                  @for (tab of tabs(); track tab.value) {
                    <ngn-tab [tabId]="tab.value">
                      <ng-template #header>{{ tab.label }}</ng-template>
                      <ng-template #content>
                        <div
                          class="p-(--ngn-size-padding-md) text-(length:--ngn-font-size-sm) text-(--ngn-color-surface-500)"
                        >
                          {{ tab.label }} content
                        </div>
                      </ng-template>
                    </ngn-tab>
                  }
                </ngn-tabs>
              } @else {
                <p class="text-(length:--ngn-font-size-sm) text-(--ngn-color-surface-500)">
                  Select items above to add tabs.
                </p>
              }
            </div>
          </div>
        </div>
      </div>
    </ngn-docs-section-shell>
  `,
})
export class NgnDocsResponsivenessSection {
  protected readonly widthPct = signal(100);

  protected readonly options = [
    { value: 'design', label: 'Design' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'product', label: 'Product' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'support', label: 'Support' },
    { value: 'finance', label: 'Finance' },
    { value: 'operations', label: 'Operations' },
  ];

  protected readonly selected = signal<string[]>([
    'design',
    'engineering',
    'product',
    'marketing',
    'sales',
    'support',
    'finance',
    'operations',
  ]);

  /** Tabs mirror the multiselect: toggling items changes how many tabs show. */
  protected readonly tabs = computed(() => {
    const values = this.selected();
    return this.options.filter(o => values.includes(o.value));
  });

  protected readonly crumbs: BreadcrumbItem[] = [
    { label: 'Home', id: 'home', callback: () => {} },
    { label: 'Workspace', id: 'workspace', callback: () => {} },
    { label: 'Projects', id: 'projects', callback: () => {} },
    { label: 'Controls', id: 'controls', callback: () => {} },
    { label: 'Responsiveness', id: 'responsiveness', callback: () => {} },
    { label: 'Overview', id: 'overview', callback: () => {} },
  ];
}
