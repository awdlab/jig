import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  Component,
  computed,
  effect,
  input,
  isDevMode,
  signal,
} from '@angular/core';
import { JigTemplate } from '@awdlab/jig/api/ng';
import { JigPt, provideSelf } from '@awdlab/jig/base';
import { JigIcon } from '@awdlab/jig/icon';
import { JigError } from '@awdlab/jig/utils';
import { meterControlTemplate } from '@awdlab/jig-themes/templates/meter';

import { MeterTemplates } from './meter-templates';

import type { MeterItem } from './types';

/** Number of palette slots every theme provides for uncolored items. */
const PALETTE_SIZE = 8;

/**
 * @category control
 */
@Component({
  selector: 'jig-meter',
  templateUrl: './meter.html',
  imports: [JigPt, JigIcon, JigTemplate, NgTemplateOutlet],
  providers: [provideSelf(JigMeter)],
  host: {
    role: 'group',
    '[attr.aria-label]': 'label()',
  },
})
export class JigMeter extends MeterTemplates {
  protected readonly theme = this.injectThemeTemplate(meterControlTemplate, {
    root: true,
    horizontal: () => !this.vertical(),
    vertical: () => this.vertical(),
  });

  /**
   * The measured items, rendered as bar segments in order.
   * @see {@link MeterItem}
   */
  public readonly items = input.required<MeterItem[]>();
  /**
   * The value the bar is filled against. Anything the items don't cover stays empty track.
   * Defaults to the sum of all item values, which fills the bar completely.
   */
  public readonly total = input<number>();
  /**
   * Whether each legend entry shows its share of the total.
   * When `false` the percentage stays available to screen readers.
   * @default true
   */
  public readonly showPercentage = input(true, { transform: booleanAttribute });
  /**
   * Whether the bar stacks upwards instead of running left to right.
   * A vertical bar takes its length from the host's height.
   * @default false
   */
  public readonly vertical = input(false, { transform: booleanAttribute });
  /**
   * Accessible name for the meter as a whole.
   */
  public readonly label = input<string>();
  /**
   * Whether hovering a segment highlights its legend entry, and the other way round.
   * Decorative only — the pairing is also carried by the swatch color.
   * @default true
   */
  public readonly highlightOnHover = input(true, { transform: booleanAttribute });

  protected readonly hoveredIndex = signal<number | null>(null);

  protected hover(index: number | null): void {
    this.hoveredIndex.set(this.highlightOnHover() ? index : null);
  }

  private readonly _sum = computed(() =>
    this.items().reduce((sum, item) => sum + Math.max(item.value, 0), 0)
  );

  protected readonly entries = computed(() => {
    const total = this.total() ?? this._sum();
    return this.items().map((item, index) => ({
      item,
      percentage: total > 0 ? (Math.max(item.value, 0) / total) * 100 : 0,
      // The fallback keeps segments visible under a base-only theme, which ships no palette.
      color: item.color ?? `var(--meter-palette-${(index % PALETTE_SIZE) + 1}, currentColor)`,
    }));
  });

  /** Rounded share, kept truthful for slivers that would otherwise read as `0%`. */
  protected percentageText(percentage: number): string {
    if (percentage > 0 && percentage < 1) {
      return '<1%';
    }
    return `${Math.round(percentage)}%`;
  }

  constructor() {
    super();
    if (isDevMode()) {
      effect(() => {
        const total = this.total();
        if (total !== undefined && this._sum() > total) {
          console.error(
            new JigError(
              'meter',
              `items add up to ${this._sum()}, which exceeds total ${total}; ` +
                `the bar is clipped at 100% and the legend reports more than 100%.`
            )
          );
        }
      });
    }
  }
}
