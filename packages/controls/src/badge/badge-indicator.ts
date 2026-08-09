import { Component, computed, input } from '@angular/core';
import { JigBase, provideSelf } from '@awdlab/jig/base';
import { badgeControlTemplate } from '@awdlab/jig-themes/templates/badge';

/** One of the four corners the badge indicator can sit in. */
export type BadgePosition = 'top-end' | 'top-start' | 'bottom-end' | 'bottom-start';

/**
 * @internal
 * The overlay element rendered by the {@link JigBadge} directive. Not intended
 * to be used directly in templates.
 * @category control
 */
@Component({
  selector: 'jig-badge-indicator',
  templateUrl: './badge-indicator.html',
  providers: [provideSelf(JigBadgeIndicator)],
  host: {
    'aria-hidden': 'true',
    '[style.--jig-badge-color]': 'bgColor() || null',
  },
})
export class JigBadgeIndicator extends JigBase<'badge'> {
  protected readonly theme = this.injectThemeTemplate(badgeControlTemplate, {
    root: true,
    dot: () => this.dot(),
    circular: () => this.circular(),
    'top-end': () => this.position() === 'top-end',
    'top-start': () => this.position() === 'top-start',
    'bottom-end': () => this.position() === 'bottom-end',
    'bottom-start': () => this.position() === 'bottom-start',
  });

  /** The rendered badge text (already max-clamped by the directive). */
  public readonly text = input<string>('');
  /** Whether to render as a dot (no text). @default false */
  public readonly dot = input<boolean>(false);
  /** Which corner the badge sits in. @default top-end */
  public readonly position = input<BadgePosition>('top-end');
  /** Position on a circular anchor's edge (~45°) instead of the box corner. @default false */
  public readonly circular = input<boolean>(false);
  /** CSS color value or `var(...)` reference for the badge fill. */
  public readonly bgColor = input<string>();

  protected readonly display = computed(() => (this.dot() ? '' : this.text()));
}
