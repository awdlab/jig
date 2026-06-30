import { Component, signal } from '@angular/core';
import tablerBook from '@iconify/icons-tabler/book';
import tablerAngular from '@iconify/icons-tabler/brand-angular';
import tablerFlask from '@iconify/icons-tabler/flask-2';
import tablerLanguage from '@iconify/icons-tabler/language';
import tablerPackage from '@iconify/icons-tabler/package';
import tablerShieldCheck from '@iconify/icons-tabler/shield-check';
import { NgnChip } from '@ngneers/controls/chip';
import { NgnIcon } from '@ngneers/controls/icon';

import { NgnDocsSectionShell } from './section-shell';
import { style } from '../../utils/code/prism';

import type { IconType } from '@ngneers/controls-custom-types';

interface DxTile {
  title: string;
  detail: string;
  snippet: string;
  highlighted: ReturnType<typeof signal<string>>;
  icon: IconType;
  /** Bento span classes — literal strings so Tailwind's scanner picks them up. */
  span: string;
  illustration?: boolean;
  features?: { label: string; note: string }[];
}

@Component({
  selector: 'ngn-docs-developer-experience-section',
  imports: [NgnDocsSectionShell, NgnIcon, NgnChip],
  template: `
    <ngn-docs-section-shell
      layout="full"
      eyebrow="Developer experience"
      heading="Built for developers"
      subtitle="Modern Angular, great defaults, no surprises."
    >
      <div
        class="grid auto-rows-[minmax(7rem,auto)] grid-cols-2 gap-(--ngn-size-padding-lg) text-left md:grid-cols-4"
      >
        @for (tile of tiles; track tile.title) {
          <div
            class="card relative flex flex-col justify-between gap-(--ngn-size-padding-md) overflow-hidden p-(--ngn-size-padding-xl)"
            [class]="tile.span"
          >
            <ngn-icon
              [icon]="tile.icon"
              class="pointer-events-none absolute top-4 right-4 text-[3rem] text-(--ngn-color-primary-200)"
            />
            <div class="relative flex flex-col gap-(--ngn-size-padding-xs)">
              <h3 class="font-(--ngn-font-weight-semibold) text-(--ngn-color-text)">
                {{ tile.title }}
              </h3>
              <p class="text-(length:--ngn-font-size-sm) text-(--ngn-color-surface-500)">
                {{ tile.detail }}
              </p>
            </div>
            @if (tile.features) {
              <ul class="relative flex flex-1 flex-wrap content-center gap-(--ngn-size-padding-sm)">
                @for (feature of tile.features; track feature.label) {
                  <li>
                    <ngn-chip color="primary">{{ feature.label }}</ngn-chip>
                  </li>
                }
              </ul>
            }
            @if (tile.illustration) {
              <!-- Abstract visual-regression diff: Expected | Actual screenshot halves. -->
              <div class="relative flex flex-1 items-center justify-center">
                <svg
                  viewBox="0 0 200 130"
                  class="h-auto w-full max-w-[16rem]"
                  role="img"
                  aria-label="Visual regression comparison of an expected and actual screenshot"
                  fill="none"
                >
                  <rect
                    x="4"
                    y="4"
                    width="192"
                    height="110"
                    rx="8"
                    fill="#0f172a"
                    stroke="#334155"
                  />
                  <rect x="16" y="18" width="60" height="8" rx="3" fill="#475569" />
                  <rect x="16" y="34" width="74" height="6" rx="3" fill="#334155" />
                  <rect x="16" y="46" width="50" height="6" rx="3" fill="#334155" />
                  <rect
                    x="16"
                    y="64"
                    width="74"
                    height="30"
                    rx="4"
                    fill="#1e293b"
                    stroke="#334155"
                  />
                  <rect x="22" y="72" width="40" height="6" rx="3" fill="#475569" />
                  <rect x="110" y="18" width="60" height="8" rx="3" fill="#475569" />
                  <rect x="110" y="34" width="74" height="6" rx="3" fill="#334155" />
                  <rect x="110" y="46" width="50" height="6" rx="3" fill="#334155" />
                  <rect
                    x="116"
                    y="62"
                    width="74"
                    height="30"
                    rx="4"
                    fill="#3f1d2e"
                    stroke="#f43f5e"
                    stroke-dasharray="3 2"
                  />
                  <rect x="122" y="70" width="52" height="6" rx="3" fill="#f43f5e" />
                  <line x1="100" y1="6" x2="100" y2="112" stroke="#94a3b8" stroke-width="1.5" />
                  <circle cx="100" cy="59" r="7" fill="#e2e8f0" stroke="#94a3b8" />
                  <path
                    d="M97 56 l-3 3 l3 3 M103 56 l3 3 l-3 3"
                    stroke="#475569"
                    stroke-width="1.2"
                  />
                  <text x="16" y="108" fill="#94a3b8" font-size="8" font-family="monospace">
                    Expected
                  </text>
                  <text x="138" y="108" fill="#f43f5e" font-size="8" font-family="monospace">
                    Actual
                  </text>
                </svg>
              </div>
            }
            <pre
              class="relative block w-fit max-w-full overflow-x-auto rounded-(--ngn-size-rounded-md) px-(--ngn-size-padding-md) py-(--ngn-size-padding-sm) text-(length:--ngn-font-size-xs)"
            ><code class="prism font-mono whitespace-nowrap" [innerHTML]="tile.highlighted()"></code></pre>
          </div>
        }
      </div>
    </ngn-docs-section-shell>
  `,
})
export class NgnDocsDeveloperExperienceSection {
  protected readonly tiles: DxTile[] = [
    {
      title: 'Cutting-edge Angular',
      detail: 'Built on the newest Angular — signals, zoneless, and reactive from day one.',
      features: [
        { label: 'Signals', note: 'inputs & models' },
        { label: 'Zoneless', note: 'no zone.js' },
        { label: 'OnPush by default', note: 'since day one' },
        { label: 'Signal Forms', note: 'reactive & typed' },
        { label: 'Native control flow', note: '@if / @for / @switch' },
        { label: 'Deferrable views', note: '@defer' },
        { label: 'Standalone APIs', note: 'no NgModules' },
      ],
      snippet: 'value = model<T>(); provideZonelessChangeDetection();',
      highlighted: signal(''),
      icon: tablerAngular,
      span: 'col-span-2 md:col-span-1 md:row-span-2',
    },
    {
      title: 'Tested',
      detail: 'Unit-tested logic plus pixel-perfect visual regression on every control.',
      snippet: 'await expectScreenshot(page)',
      highlighted: signal(''),
      icon: tablerFlask,
      span: 'col-span-2 md:col-span-1 md:row-span-2',
      illustration: true,
    },
    {
      title: 'Tree-shakeable',
      detail:
        'Each control is its own entry point — import one and the rest never reaches your bundle.',
      snippet: "import { NgnInput } from '@ngneers/controls/input';",
      highlighted: signal(''),
      icon: tablerPackage,
      span: 'col-span-2 md:col-span-2',
    },
    {
      title: 'Strict TypeScript',
      detail:
        'Every input, model, and event is fully typed — your editor autocompletes the whole public API.',
      snippet: 'value = model<Date>(); // (valueChange): Date',
      highlighted: signal(''),
      icon: tablerShieldCheck,
      span: 'col-span-2 md:col-span-2',
    },
    {
      title: 'Localizable',
      detail:
        'Ships with built-in UI translations, accepts your own languages, and formats dates & numbers to any locale.',
      snippet: "registerCustomLanguage(de); dateFormat = 'dd.MM.yyyy HH:mm'",
      highlighted: signal(''),
      icon: tablerLanguage,
      span: 'col-span-2 md:col-span-2',
    },
    {
      title: 'Documented',
      detail:
        'Every control ships live examples, an interactive playground, and a complete, typed API reference.',
      snippet: '// Live demos · Playground · API docs — for every control',
      highlighted: signal(''),
      icon: tablerBook,
      span: 'col-span-2 md:col-span-2',
    },
  ];

  constructor() {
    for (const tile of this.tiles) {
      style(tile.snippet).then(html => tile.highlighted.set(html));
    }
  }
}
