import {
  booleanAttribute,
  Component,
  computed,
  contentChildren,
  effect,
  input,
  model,
  viewChildren,
} from '@angular/core';
import { NgnBase, NgnPt, provideSelf } from '@ngneers/controls/base';
import { NgnDefer } from '@ngneers/controls/defer';
import { NgnIcon } from '@ngneers/controls/icon';
import { NgnRovingGroup, NgnRovingItem } from '@ngneers/controls/roving-focus';
import { stepperControlTemplate } from '@ngneers/controls-themes/templates/stepper';

import { NgnStep } from './step';

/**
 * @category control
 */
@Component({
  selector: 'ngn-stepper',
  templateUrl: './stepper.html',
  imports: [NgnPt, NgnDefer, NgnIcon, NgnRovingGroup, NgnRovingItem],
  providers: [provideSelf(NgnStepper)],
})
export class NgnStepper extends NgnBase<'stepper'> {
  protected readonly theme = this.injectThemeTemplate(stepperControlTemplate, 'root');

  protected readonly steps = contentChildren(NgnStep);

  /** The header buttons' roving items, in step order (one per step; connectors are plain spans). */
  private readonly _rovingItems = viewChildren(NgnRovingItem);

  /** The active step index (zero-based). @default 0 */
  public readonly active = model<number>(0);
  /** Gate forward navigation on prior steps being `completed`. @default false */
  public readonly linear = input(false, { transform: booleanAttribute });
  /** Lazily render step content (forwarded to `ngn-defer`). @default true */
  public readonly lazy = input(true, { transform: booleanAttribute });
  /** Keep opened step content in the DOM to preserve state (forwarded to `ngn-defer`). @default true */
  public readonly cache = input(true, { transform: booleanAttribute });

  /**
   * Index of the first step that is not yet completed (the furthest reachable in linear mode).
   * Optional steps are exempt — an incomplete optional step never blocks forward progress.
   */
  private readonly _firstIncomplete = computed(() => {
    const steps = this.steps();
    const idx = steps.findIndex(s => !s.completed() && !s.optional());
    return idx === -1 ? steps.length - 1 : idx;
  });

  constructor() {
    super();
    // Clamp active into range when steps change.
    effect(() => {
      const n = this.steps().length;
      if (n === 0) {
        return;
      }
      const a = this.active();
      if (a > n - 1) {
        this.active.set(n - 1);
      } else if (a < 0) {
        this.active.set(0);
      }
    });

    // Keep each header's roving item in sync with its step's NATIVE `disabled` input (not
    // `canGoTo()` gating) — a merely gated step stays arrow-focusable, only a truly disabled
    // step is skipped by keyboard navigation. Mirrors NgnButtonGroup's roving-disabled sync.
    effect(() => {
      const items = this._rovingItems();
      const steps = this.steps();
      items.forEach((item, i) => item.disabled.set(!!steps[i]?.disabled()));
    });
  }

  /** Whether navigation to `index` is currently permitted. */
  public canGoTo(index: number): boolean {
    const steps = this.steps();
    const step = steps[index];
    if (!step || step.disabled()) {
      return false;
    }
    if (!this.linear()) {
      return true;
    }
    // Linear: can go backward freely, or forward up to the first incomplete step.
    return index <= Math.max(this.active(), this._firstIncomplete());
  }

  public goTo(index: number): void {
    if (this.canGoTo(index)) {
      this.active.set(index);
    }
  }

  public next(): void {
    this.goTo(this.active() + 1);
  }

  public previous(): void {
    this.goTo(this.active() - 1);
  }

  protected onHeaderActivate(index: number): void {
    this.goTo(index);
  }
}
