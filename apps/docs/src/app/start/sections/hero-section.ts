import { HttpClient } from '@angular/common/http';
import { Component, afterNextRender, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgnButton } from '@awdlab/jig/button';

import { CONTROL_COUNT } from './controls-count';

interface Stats {
  version: string | null;
}

/**
 * Headline phrases; the middle segment carries the gradient treatment and links
 * to the section that backs the claim (`target` = a section id from `start.ts`).
 */
interface Phrase {
  readonly pre: string;
  readonly hl: string;
  readonly post: string;
  readonly target: string;
}

const PHRASES: readonly Phrase[] = [
  { pre: 'Build beautiful ', hl: 'Angular', post: ' apps, faster', target: 'demo' },
  { pre: 'Your ', hl: 'design system', post: ', not ours', target: 'theming' },
  { pre: 'Accessible by ', hl: 'default', post: ', not by audit', target: 'accessibility' },
  { pre: 'The ', hl: 'compiler', post: ' has your back', target: 'developer-experience' },
  { pre: 'Built on ', hl: 'native', post: ' browser primitives', target: 'under-the-hood' },
];

const INSTALL_COMMAND = 'pnpm add @awdlab/jig';

/** Hero stat row; the proof line appears on hover. */
const STATS = [
  {
    value: `${CONTROL_COUNT}+`,
    label: 'controls',
    proof: 'Each one themed, tested and documented — no half-finished exports.',
  },
  {
    value: '0',
    label: 'zones',
    proof: 'No zone.js in the bundle; signals drive change detection.',
  },
  {
    value: 'AA',
    label: 'wcag 2.2',
    proof: 'Keyboard paths and axe checks run on every control in CI.',
  },
  {
    value: '100%',
    label: 'typed',
    proof: 'Generic inputs, models and templates — no any, no string keys.',
  },
] as const;

/** How long each headline stays before the next one rises in. */
const HOLD_MS = 3400;

const EGG_PACKAGES = ['@awdlab/jig-THEMES', '@awdlab/jig-PLAYWRIGHT', '@awdlab/jig-MCP'] as const;

@Component({
  selector: 'awd-docs-hero-section',
  imports: [NgnButton, RouterLink],
  host: { '[style.--hero-hold]': "holdMs + 'ms'" },
  styles: [
    `
      /* All headline layers share one grid cell, so the block is as tall as the
         longest phrase and nothing shifts between swaps. */
      .hero-stack,
      .hero-sizer {
        display: grid;
      }

      .hero-stack > *,
      .hero-sizer > * {
        grid-area: 1 / 1;
      }

      .hero-sizer {
        visibility: hidden;
        pointer-events: none;
      }

      :host {
        --hero-font-size: clamp(2.75rem, 8vw, 6.5rem);
      }

      /* Two headline lines tall: 2 × line-height(0.9) × font-size. */
      .hero-logo {
        height: calc(var(--hero-font-size) * 1.8);
        width: auto;
      }

      .hero-line {
        margin: 0;
        font-size: var(--hero-font-size);
        line-height: 0.9;
        font-weight: var(--awd-font-weight-bold);
        letter-spacing: -0.025em;
        text-wrap: balance;
      }

      .hero-line-in {
        animation: hero-rise 640ms cubic-bezier(0.4, 0, 0.2, 1);
      }

      /* Slower and shallower than the rise. Opacity eases *in* — a decelerating
         curve would hold it near 0 for the last third and read as a stall — while
         the drift keeps the soft ease-out. */
      .hero-line-out {
        animation:
          hero-fade-out 600ms cubic-bezier(0.4, 0, 0.2, 1) forwards,
          hero-drift-out 600ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
      }

      @keyframes hero-rise {
        from {
          opacity: 0;
          transform: translateY(26px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes hero-fade-out {
        from {
          opacity: 1;
        }
        to {
          opacity: 0;
        }
      }

      @keyframes hero-drift-out {
        from {
          transform: translateY(0);
        }
        to {
          transform: translateY(-26px);
        }
      }

      /* The active dot's fill is the cycle timer: its animationend advances the
         headline, so pausing the animation pauses the whole rotation. */
      .hero-dot-fill {
        height: 100%;
        background: linear-gradient(90deg, #e90464, #f736e3);
        animation: hero-dot var(--hero-hold) linear both;
      }

      @keyframes hero-dot {
        from {
          width: 0%;
        }
        to {
          width: 100%;
        }
      }

      .hero-dot-fill-pinned {
        width: 100%;
        animation: none;
      }

      /* Let a reader finish the line they are on. */
      .hero-cycle:hover .hero-dot-fill {
        animation-play-state: paused;
      }

      .hero-egg {
        opacity: 0;
        transform: translateY(8px);
        transition:
          opacity 0.24s ease,
          transform 0.32s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .hero-egg-host:hover .hero-egg,
      .hero-egg-host:focus-within .hero-egg {
        opacity: 1;
        transform: translateY(0);
      }

      /* Proof line keeps its space reserved, so revealing it shifts nothing. */
      .hero-stat-proof {
        display: block;
        min-height: 2.8em;
        padding-top: 0.5em;
        max-width: 26ch;
        line-height: 1.4;
        color: var(--awd-color-surface-400);
        opacity: 0;
        transform: translateY(3px);
        transition:
          opacity 0.24s ease,
          transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .hero-stat:hover .hero-stat-proof {
        opacity: 1;
        transform: translateY(0);
      }

      /* No hover to reveal it on touch devices, so keep it visible. */
      @media (hover: none) {
        .hero-stat-proof {
          opacity: 1;
          transform: none;
        }
      }

      .hero-link {
        color: inherit;
        text-decoration: none;
        border-radius: 4px;
        outline-offset: 6px;
      }

      .hero-link:hover .awd-angular-text,
      .hero-link:focus-visible .awd-angular-text {
        text-decoration: underline;
        text-decoration-color: #f736e3;
        text-decoration-thickness: 0.06em;
        text-underline-offset: 0.12em;
      }

      .hero-rule {
        position: relative;
        height: 2px;
        background: linear-gradient(
          90deg,
          transparent,
          #e90464 30%,
          #f736e3 50%,
          #5c44e4 70%,
          transparent
        );
      }

      .hero-cta {
        box-shadow: 0 8px 26px color-mix(in srgb, var(--awd-color-primary-500) 22%, transparent);
        transition:
          transform 0.2s ease,
          box-shadow 0.25s ease;
      }

      .hero-cta:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 34px color-mix(in srgb, var(--awd-color-primary-500) 40%, transparent);
      }

      .hero-cta-ghost {
        transition:
          transform 0.2s ease,
          border-color 0.2s ease,
          box-shadow 0.25s ease;
      }

      .hero-cta-ghost:hover {
        transform: translateY(-2px);
        border-color: var(--awd-color-primary-500) !important;
        box-shadow: 0 10px 30px color-mix(in srgb, var(--awd-color-primary-500) 18%, transparent);
      }

      @media (prefers-reduced-motion: reduce) {
        /* Not "none": the outgoing layer is removed on animationend, so it still
           needs the event to fire. */
        .hero-line-in,
        .hero-line-out {
          animation-duration: 1ms;
        }

        .hero-dot-fill,
        .hero-egg,
        .hero-stat-proof,
        .hero-cta,
        .hero-cta-ghost {
          animation: none;
          transition: none;
        }

        .hero-cta:hover,
        .hero-cta-ghost:hover {
          transform: none;
        }
      }
    `,
  ],
  template: `
    <section class="px-(--awd-size-padding-xl) pt-32 lg:pt-44">
      <div class="mx-auto flex max-w-[1240px] flex-col gap-7">
        <div
          class="mono flex items-center justify-between gap-(--awd-size-padding-lg) text-[0.72rem] tracking-[0.16em] text-(--awd-color-surface-500) uppercase"
        >
          <!-- Hovering the package name lifts the rest of the family into view. -->
          <span class="hero-egg-host relative inline-flex">
            <span
              class="hero-egg absolute bottom-full left-0 flex flex-col gap-[7px] pb-(--awd-size-padding-md)"
            >
              @for (pkg of eggPackages; track pkg) {
                <a
                  href="https://www.npmjs.com/package/{{ pkg.toLowerCase() }}"
                  target="_blank"
                  rel="noopener"
                  class="whitespace-nowrap text-inherit no-underline hover:text-(--awd-color-text)"
                  >{{ pkg }}
                </a>
              }
            </span>
            <a
              href="https://www.npmjs.com/package/@awdlab/jig"
              target="_blank"
              rel="noopener"
              class="whitespace-nowrap text-inherit no-underline hover:text-(--awd-color-text)"
            >
              &#64;awdlab/jig
            </a>
          </span>
          <button
            type="button"
            class="hero-badge mono inline-flex shrink-0 cursor-pointer items-center gap-(--awd-size-padding-sm) rounded-full border border-(--awd-color-surface-300) bg-transparent px-(--awd-size-padding-md) py-1 text-[0.72rem] tracking-[0.1em] whitespace-nowrap text-(--awd-color-text) uppercase"
            [attr.aria-label]="'Copy install command: ' + installCommand"
            (click)="copyInstall()"
          >
            <span class="size-1.5 rounded-full bg-(--awd-color-primary-500)"></span>
            @if (copied()) {
              copied ✓
            } @else {
              v{{ version() ?? '…' }}
            }
          </button>
          <span aria-live="polite" class="sr-only">{{
            copied() ? 'Install command copied' : ''
          }}</span>
        </div>

        <div class="hero-cycle flex flex-col gap-7">
          <div class="flex items-center gap-(--awd-size-padding-xl)">
            <img
              src="img/logo.png"
              alt=""
              width="512"
              height="512"
              class="hero-logo hidden shrink-0 sm:block"
            />
            <div class="hero-stack max-w-[1000px] text-(--awd-color-text)">
              <div class="hero-sizer" aria-hidden="true">
                @for (phrase of phrases; track phrase.hl) {
                  <span class="hero-line">{{ phrase.pre }}{{ phrase.hl }}{{ phrase.post }}</span>
                }
              </div>
              <!-- The outgoing line sinks out while the next one rises in. -->
              @for (gone of leavingPhrase(); track gone.hl) {
                <div
                  class="hero-line hero-line-out"
                  aria-hidden="true"
                  (animationend)="clearLeaving()"
                >
                  {{ gone.pre }}<span class="awd-angular-text">{{ gone.hl }}</span
                  >{{ gone.post }}
                </div>
              }
              <!-- Keyed on the phrase so each swap creates a fresh node and replays the rise. -->
              @for (phrase of activePhrase(); track phrase.hl) {
                <h1 class="hero-line hero-line-in">
                  {{ phrase.pre
                  }}<a
                    class="hero-link"
                    [href]="'#' + phrase.target"
                    (click)="jumpTo($event, phrase.target)"
                    ><span class="awd-angular-text">{{ phrase.hl }}</span></a
                  >{{ phrase.post }}
                </h1>
              }
            </div>
          </div>

          <div class="flex items-center gap-(--awd-size-padding-md)">
            @for (phrase of phrases; track phrase.hl; let i = $index) {
              <button
                type="button"
                class="flex cursor-pointer items-center border-none bg-transparent px-0 py-(--awd-size-padding-sm)"
                [attr.aria-label]="
                  (i === index() && pinned() ? 'Resume rotation, headline: ' : 'Show headline: ') +
                  phrase.pre +
                  phrase.hl +
                  phrase.post
                "
                [attr.aria-current]="i === index() ? 'true' : null"
                (click)="goTo(i)"
              >
                <span
                  class="h-2 overflow-hidden rounded-full bg-(--awd-color-surface-200) transition-[width] duration-300"
                  [class]="i === index() ? 'w-[30px]' : 'w-2'"
                >
                  @if (i === index()) {
                    <!-- Pinned: full fill, no animation — so nothing advances the cycle. -->
                    @if (pinned()) {
                      <span class="hero-dot-fill hero-dot-fill-pinned block"></span>
                    } @else {
                      <span class="hero-dot-fill block" (animationend)="next()"></span>
                    }
                  }
                </span>
              </button>
            }
            @if (pinned()) {
              <span
                class="mono text-[0.68rem] tracking-[0.14em] text-(--awd-color-surface-400) uppercase"
              >
                paused · click again to resume
              </span>
            }
          </div>
        </div>

        <div
          class="grid items-end gap-(--awd-size-padding-xl) pb-8 lg:grid-cols-[1fr_auto] lg:gap-14"
        >
          <p
            class="m-0 max-w-[520px] text-(length:--awd-font-size-lg) leading-relaxed text-(--awd-color-surface-600)"
          >
            A
            <a
              ngnButton
              kind="link"
              ngnButtonInline
              href="#developer-experience"
              (click)="jumpTo($event, 'developer-experience')"
              >signals-native</a
            >, zoneless,
            <a
              ngnButton
              kind="link"
              ngnButtonInline
              href="#accessibility"
              (click)="jumpTo($event, 'accessibility')"
              >accessible</a
            >
            component library — themed by
            <a
              ngnButton
              kind="link"
              ngnButtonInline
              href="#theming"
              (click)="jumpTo($event, 'theming')"
              >design tokens</a
            >
            and built on
            <a
              ngnButton
              kind="link"
              ngnButtonInline
              href="#under-the-hood"
              (click)="jumpTo($event, 'under-the-hood')"
              >native browser primitives</a
            >.
          </p>
          <div class="flex flex-wrap items-center gap-(--awd-size-padding-md)">
            <a
              ngnButton
              kind="primary"
              routerLink="/guides/introduction"
              class="hero-cta group rounded-full px-(--awd-size-padding-xl) text-(length:--awd-font-size-md) font-(--awd-font-weight-bold)"
            >
              Get Started
              <span
                aria-hidden="true"
                class="inline-block transition-transform duration-200 group-hover:translate-x-1"
              >
                →
              </span>
            </a>
            <a
              ngnButton
              kind="secondary"
              routerLink="/components"
              class="hero-cta-ghost rounded-full px-(--awd-size-padding-xl) text-(length:--awd-font-size-md) font-(--awd-font-weight-bold)"
            >
              View Components
            </a>
          </div>
        </div>
      </div>

      <div class="hero-rule"></div>

      <div
        class="mono mx-auto grid max-w-[1240px] grid-cols-2 gap-x-(--awd-size-padding-lg) gap-y-(--awd-size-padding-lg) pt-8 pb-20 text-(length:--awd-font-size-sm) text-(--awd-color-surface-500) sm:grid-cols-4 lg:pb-28"
      >
        <!-- The proof line stays in the a11y tree; hovering just fades it in. -->
        @for (stat of stats; track stat.label) {
          <div class="hero-stat group">
            <span
              ><span class="text-(--awd-color-text)">{{ stat.value }}</span> {{ stat.label }}</span
            >
            <span class="hero-stat-proof">{{ stat.proof }}</span>
          </div>
        }
      </div>
    </section>
  `,
})
export class NgnDocsHeroSection {
  private readonly _http = inject(HttpClient);

  protected readonly stats = STATS;
  protected readonly version = signal<string | null>(null);

  protected readonly phrases = PHRASES;
  protected readonly eggPackages = EGG_PACKAGES;
  protected readonly holdMs = HOLD_MS;

  protected readonly installCommand = INSTALL_COMMAND;
  protected readonly copied = signal(false);

  protected readonly index = signal(0);
  protected readonly pinned = signal(false);
  /** Single-item lists so `@for` can key each layer and replay its animation. */
  protected readonly activePhrase = computed(() => [PHRASES[this.index() % PHRASES.length]!]);
  private readonly _leaving = signal<Phrase | null>(null);
  protected readonly leavingPhrase = computed(() => {
    const gone = this._leaving();
    return gone ? [gone] : [];
  });

  constructor() {
    // Browser-only: /api/stats has no live server during prerender.
    afterNextRender(() => {
      this._http.get<Stats>('/api/stats').subscribe({
        next: stats => this.version.set(stats.version),
        error: () => {
          // Leave the signal null — the badge keeps the "…" placeholder.
        },
      });
    });
  }

  /** Driven by the active dot's fill animation ending, so hover pauses it too. */
  protected next() {
    this._show((this.index() + 1) % PHRASES.length);
  }

  /** A click pins the picked headline; clicking it again resumes the rotation. */
  protected goTo(index: number) {
    if (index === this.index()) {
      this.pinned.update(pinned => !pinned);
      return;
    }
    this._show(index);
    this.pinned.set(true);
  }

  protected clearLeaving() {
    this._leaving.set(null);
  }

  private _show(index: number) {
    this._leaving.set(PHRASES[this.index() % PHRASES.length]!);
    this.index.set(index);
  }

  protected async copyInstall() {
    try {
      await navigator.clipboard.writeText(INSTALL_COMMAND);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1800);
    } catch {
      // Clipboard denied — leave the badge as it was.
    }
  }

  /** The page scrolls in its own container, so `scrollIntoView` beats a hash jump. */
  protected jumpTo(event: Event, id: string) {
    const target = document.getElementById(id);
    if (!target) {
      return;
    }
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
