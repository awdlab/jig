import { Component, computed, signal } from '@angular/core';
import { NgnInputField } from '@ngneers/controls/input-field';
import { NgnSelect } from '@ngneers/controls/select';
import { NgnSelectButton } from '@ngneers/controls/select-button';

import { NgnDocsReveal } from './reveal';
import { NgnDocsSectionHeader } from './section-header';
import { style } from '../../utils/code/prism';

import type { NgnItem } from '@ngneers/controls/api';

/** Kind badge shown in the autocomplete list, mirroring an editor's member icons. */
type MemberKind = 'M' | 'O' | 'I';

type StageId = 'discovery' | 'proposal' | 'won';

const STAGES: readonly NgnItem<unknown, StageId>[] = [
  { label: 'Discovery', value: 'discovery' },
  { label: 'Proposal', value: 'proposal' },
  { label: 'Won', value: 'won' },
];

interface Member {
  name: string;
  kind: MemberKind;
  /** Type as the editor would render it, per mode. */
  single: string;
  multiple: string;
}

const MEMBERS: readonly Member[] = [
  {
    name: 'options',
    kind: 'I',
    single: 'InputSignal<NgnItem<unknown, StageId>[]>',
    multiple: 'InputSignal<NgnItem<unknown, StageId>[]>',
  },
  {
    name: 'value',
    kind: 'M',
    single: 'ModelSignal<StageId | null>',
    multiple: 'ModelSignal<StageId[] | null>',
  },
  {
    name: 'valueChange',
    kind: 'O',
    single: 'OutputRef<StageId | null>',
    multiple: 'OutputRef<StageId[] | null>',
  },
];

const KIND_CLASS: Record<MemberKind, string> = {
  M: 'bg-(--ngn-color-primary-500)',
  O: 'bg-(--ngn-color-accent-500)',
  I: 'bg-(--ngn-color-success-500)',
};

const CODE_SINGLE = `type StageId = 'discovery' | 'proposal' | 'won';

@Component({
  imports: [NgnInputField, NgnSelect],
  template: \`
    <ngn-input-field label="Stage" labelKind="on">
      <ngn-select
        [options]="stages"
        [(value)]="stage"
      />
    </ngn-input-field>
  \`,
})
export class DealFormComponent {
  stages: NgnItem<unknown, StageId>[] = STAGES;
  stage = signal<StageId | null>(null);
}`;

const CODE_MULTIPLE = `type StageId = 'discovery' | 'proposal' | 'won';

@Component({
  imports: [NgnInputField, NgnSelect],
  template: \`
    <ngn-input-field label="Stages" labelKind="on">
      <ngn-select
        [multiple]="true"
        [options]="stages"
        [(value)]="stage"
      />
    </ngn-input-field>
  \`,
})
export class DealFormComponent {
  stages: NgnItem<unknown, StageId>[] = STAGES;
  stage = signal<StageId[] | null>(null);
}`;

interface Fact {
  metric: string;
  metricClass: string;
  title: string;
  body: string;
}

const FACTS: readonly Fact[] = [
  {
    metric: '100%',
    metricClass: 'text-(--ngn-color-primary-500)',
    title: 'Typed public API',
    body: 'Inputs, models and outputs are generic — no any, no string keys, no guessing.',
  },
  {
    metric: '1',
    metricClass: 'text-(--ngn-color-text)',
    title: 'Import per control',
    body: 'Own entry point each, so only what you render reaches the bundle.',
  },
  {
    metric: 'CI',
    metricClass: 'text-(--ngn-color-success-500)',
    title: 'Unit + visual tests',
    body: 'Screenshot regression and axe checks run on every control, every release.',
  },
  {
    metric: 'i18n',
    metricClass: 'text-(--ngn-color-warning-500)',
    title: 'Locale aware',
    body: 'Bundled UI translations; dates and numbers follow the active locale.',
  },
];

@Component({
  selector: 'ngn-docs-developer-experience-section',
  imports: [NgnInputField, NgnSelect, NgnSelectButton, NgnDocsReveal, NgnDocsSectionHeader],
  host: { class: 'block px-(--ngn-size-padding-xl) py-12 lg:py-16' },
  styles: [
    `
      /* Rows whose type differs between the two modes light up when the mode flips. */
      .flash {
        animation: ngn-dx-flash 1.2s ease-out;
      }

      @keyframes ngn-dx-flash {
        0%,
        45% {
          background: color-mix(in srgb, var(--ngn-color-primary-500) 22%, transparent);
        }
        100% {
          background: transparent;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .flash {
          animation: none;
        }
      }
    `,
  ],
  template: `
    <div [ngnDocsReveal]="0" class="mx-auto max-w-[1100px]">
      <ngn-docs-section-header
        class="mb-8 lg:mb-12"
        eyebrow="Developer experience"
        heading="Your editor already knows the API"
        subtitle="Typed inputs, models and events — discoverable without leaving the file. Switch between single and multiple selection: the control changes, and the value type changes with it."
      />

      <div
        class="overflow-hidden rounded-(--ngn-size-rounded-lg) border border-(--ngn-color-surface-200) bg-(--ngn-color-surface-25)"
      >
        <div class="grid grid-cols-1 lg:grid-cols-2">
          <div class="border-b border-(--ngn-color-surface-200) lg:border-r lg:border-b-0">
            <div
              class="flex flex-wrap items-center gap-(--ngn-size-padding-lg) border-b border-(--ngn-color-surface-200) px-(--ngn-size-padding-xl) py-(--ngn-size-padding-md)"
            >
              <span class="text-(length:--ngn-font-size-sm) text-(--ngn-color-surface-600)">
                Let users pick
              </span>
              <ngn-select-button
                aria-label="Selection mode"
                [options]="modes"
                [value]="mode()"
                (valueChange)="mode.set($event)"
              />
              <span class="text-(length:--ngn-font-size-sm) text-(--ngn-color-surface-600)">
                {{ multiple() ? 'several stages' : 'one stage' }}
              </span>
            </div>

            <!-- The same control, live: the toggle changes what a user can pick
                 here and the value type in the code below at the same time. -->
            <div
              class="flex flex-col gap-(--ngn-size-padding-md) border-b border-(--ngn-color-surface-200) px-(--ngn-size-padding-xl) py-(--ngn-size-padding-lg)"
            >
              <!-- $any: a dynamically bound multiple widens the value to an array at
                   runtime, while the static type follows the literal. -->
              <ngn-input-field
                class="w-full"
                labelKind="on"
                [label]="multiple() ? 'Stages' : 'Stage'"
              >
                <ngn-select
                  [multiple]="multiple()"
                  [options]="stages"
                  [value]="$any(selectValue())"
                  (valueChange)="picked.set($event)"
                  [placeholder]="multiple() ? 'Pick stages…' : 'Pick a stage…'"
                />
              </ngn-input-field>
              <span class="mono text-(length:--ngn-font-size-sm) text-(--ngn-color-surface-500)">
                value = {{ valuePreview() }}
              </span>
            </div>

            <div class="p-(--ngn-size-padding-xl)">
              <p
                class="mono mb-(--ngn-size-padding-lg) text-(length:--ngn-font-size-sm) text-(--ngn-color-surface-500)"
              >
                deal-form.component.ts
              </p>
              <pre
                class="overflow-x-auto text-(length:--ngn-font-size-sm)"
              ><code class="prism" [innerHTML]="highlighted()"></code></pre>

              <!-- Editor autocomplete, mocked: the member list your IDE offers on the
                   select instance, typed by the generic you passed in. -->
              <div aria-hidden="true" class="mono mt-(--ngn-size-padding-xl)">
                <p class="text-(--ngn-color-text)">
                  this.select()<span class="text-(--ngn-color-surface-400)">.</span
                  ><span class="animate-pulse">|</span>
                </p>
                <div
                  class="mt-(--ngn-size-padding-sm) ml-(--ngn-size-padding-xl) overflow-hidden rounded-(--ngn-size-rounded-md) border border-(--ngn-color-surface-300) bg-(--ngn-color-surface-50) shadow-(--ngn-shadow-md)"
                >
                  <!-- track includes the mode so rows re-create and the flash replays. -->
                  @for (member of members; track member.name + mode(); let first = $first) {
                    <div
                      class="flex items-center justify-between gap-(--ngn-size-padding-xl) px-(--ngn-size-padding-md) py-(--ngn-size-padding-sm) text-(length:--ngn-font-size-sm)"
                      [class]="first ? 'bg-(--ngn-color-primary-100)' : ''"
                      [class.flash]="member.single !== member.multiple"
                    >
                      <span class="flex items-center gap-(--ngn-size-padding-md)">
                        <span
                          class="flex size-4 shrink-0 items-center justify-center rounded-(--ngn-size-rounded-sm) text-[0.625rem] text-(--ngn-color-primary-500-contrast)"
                          [class]="kindClass[member.kind]"
                        >
                          {{ member.kind }}
                        </span>
                        <span class="text-(--ngn-color-text)">{{ member.name }}</span>
                      </span>
                      <span class="text-(--ngn-color-surface-500)">
                        {{ multiple() ? member.multiple : member.single }}
                      </span>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-col">
            @for (fact of facts; track fact.title; let last = $last) {
              <div
                class="flex flex-1 items-start gap-(--ngn-size-padding-xl) p-(--ngn-size-padding-xl)"
                [class]="last ? '' : 'border-b border-(--ngn-color-surface-200)'"
              >
                <span
                  class="w-[4.5rem] shrink-0 text-[1.5rem] leading-none font-(--ngn-font-weight-bold)"
                  [class]="fact.metricClass"
                >
                  {{ fact.metric }}
                </span>
                <div>
                  <h3
                    class="my-0 text-(length:--ngn-font-size-md) font-(--ngn-font-weight-semibold) text-(--ngn-color-text)"
                  >
                    {{ fact.title }}
                  </h3>
                  <p class="text-(length:--ngn-font-size-sm) text-(--ngn-color-surface-600)">
                    {{ fact.body }}
                  </p>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class NgnDocsDeveloperExperienceSection {
  protected readonly members = MEMBERS;
  protected readonly kindClass = KIND_CLASS;
  protected readonly facts = FACTS;

  protected readonly modes = [
    { label: 'Single', value: 'single' },
    { label: 'Multiple', value: 'multiple' },
  ];

  protected readonly mode = signal('single');
  protected readonly multiple = computed(() => this.mode() === 'multiple');

  protected readonly stages = STAGES;
  protected readonly picked = signal<StageId | StageId[] | null>('proposal');

  /** Carries the picked stage(s) across a mode switch: scalar ⇆ array. */
  protected readonly selectValue = computed(() => {
    const value = this.picked();
    if (this.multiple()) {
      return value == null ? [] : Array.isArray(value) ? value : [value];
    }
    return Array.isArray(value) ? (value[0] ?? null) : value;
  });

  /** Mirrors what the bound signal holds, so the type shift is visible, not just claimed. */
  protected readonly valuePreview = computed(() => JSON.stringify(this.selectValue() ?? null));

  private readonly _codeSingle = signal('');
  private readonly _codeMultiple = signal('');

  protected readonly highlighted = computed(() =>
    this.multiple() ? this._codeMultiple() : this._codeSingle()
  );

  constructor() {
    void style(CODE_SINGLE).then(html => this._codeSingle.set(html));
    void style(CODE_MULTIPLE).then(html => this._codeMultiple.set(html));
  }
}
