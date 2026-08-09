import {
  afterNextRender,
  booleanAttribute,
  ComponentRef,
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  ViewContainerRef,
} from '@angular/core';
import { Platform, setComponentInput } from '@awdlab/jig/api/ng';

import { JigBadgeIndicator, type BadgePosition } from './badge-indicator';

/**
 * Overlays a small badge (count, text, or dot) onto its host element — an icon,
 * button, or avatar. The badge is injected as an absolutely-positioned overlay,
 * so the host is made `position: relative` when it is currently static.
 *
 * @category directive
 */
@Directive({
  // Also match `[jigBadgeDot]` so dot mode works standalone (no value/`jigBadge` needed).
  selector: '[jigBadge], [jigBadgeDot]',
})
export class JigBadge {
  private readonly _vcr = inject(ViewContainerRef);
  private readonly _host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly _destroyRef = inject(DestroyRef);
  private _ref?: ComponentRef<JigBadgeIndicator>;

  /** Badge content. A number is clamped by {@link max}; empty hides the badge unless {@link dot}. */
  public readonly value = input<number | string | undefined>(undefined, { alias: 'jigBadge' });
  /** Clamp a numeric {@link value} to `"{max}+"` when it exceeds this. */
  public readonly max = input<number | undefined>(undefined, { alias: 'jigBadgeMax' });
  /** Render a dot with no text, ignoring {@link value}. @default false */
  public readonly dot = input(false, { transform: booleanAttribute, alias: 'jigBadgeDot' });
  /** Show the badge even when {@link value} is `0`. @default false */
  public readonly showZero = input(false, {
    transform: booleanAttribute,
    alias: 'jigBadgeShowZero',
  });
  /** Which corner the badge sits in. @default top-end */
  public readonly position = input<BadgePosition>('top-end', { alias: 'jigBadgePosition' });
  /** CSS color value (hex/rgb) or `var(...)` reference for the badge fill. */
  public readonly color = input<string | undefined>(undefined, { alias: 'jigBadgeColor' });
  /** Hide the badge without removing the host. @default false */
  public readonly hidden = input(false, { transform: booleanAttribute, alias: 'jigBadgeHidden' });
  /** Anchor on a circular host's edge (~45°) instead of the box corner (e.g. avatars). @default false */
  public readonly circular = input(false, {
    transform: booleanAttribute,
    alias: 'jigBadgeCircular',
  });

  private readonly _platform = inject(Platform);

  constructor() {
    // Ensure the host can anchor the absolutely-positioned indicator. This must run in
    // `afterNextRender` (browser-only, never during SSR): in the constructor the host is
    // not yet connected, so `getComputedStyle(host).position` returns '' (not 'static')
    // and the guard would silently skip — leaving the badge to position against the
    // viewport instead of the host.
    afterNextRender(() => {
      if (getComputedStyle(this._host).position === 'static') {
        this._host.style.position = 'relative';
      }
    });

    effect(() => {
      // Create the indicator browser-only. It is injected via `ViewContainerRef` and then
      // moved into the host DOM; doing that during SSR serializes a dehydrated view whose
      // anchor no longer matches the moved node, crashing hydration ("Expecting instance of
      // DOM Element"). The badge is decorative (aria-hidden), so it appears on hydration.
      if (!this._platform.isBrowser) {
        return;
      }
      const text = this.resolveText();
      const visible = !this.hidden() && (this.dot() || text !== null);

      if (!visible) {
        this.teardown();
        return;
      }
      if (!this._ref) {
        this._ref = this._vcr.createComponent(JigBadgeIndicator);
        this._host.appendChild(this._ref.location.nativeElement);
      }
      setComponentInput(this._ref, 'text', text ?? '');
      setComponentInput(this._ref, 'dot', this.dot());
      setComponentInput(this._ref, 'position', this.position());
      setComponentInput(this._ref, 'circular', this.circular());
      setComponentInput(this._ref, 'bgColor', this.color());
    });

    this._destroyRef.onDestroy(() => this.teardown());
  }

  /** Returns the string to render, or `null` when the badge should not show. */
  private resolveText(): string | null {
    if (this.dot()) {
      return '';
    }
    const value = this.value();
    if (value === undefined || value === null || value === '') {
      return null;
    }
    if (typeof value === 'number') {
      if (value === 0 && !this.showZero()) {
        return null;
      }
      const max = this.max();
      if (max !== undefined && value > max) {
        return `${max}+`;
      }
      return String(value);
    }
    return value;
  }

  private teardown(): void {
    if (this._ref) {
      this._ref.destroy();
      this._ref = undefined;
    }
  }
}
