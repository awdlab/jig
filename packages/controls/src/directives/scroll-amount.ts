import {
  afterRenderEffect,
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { domEventObservable, elementSizeSignal } from '@awdlab/jig/api/ng';
import { map } from 'rxjs';

/** Remaining scrollable distance to the end, clamped at 0. Pure for testing. */
export function computeDistanceFromEnd(
  scrollSize: number,
  clientSize: number,
  scrollPos: number
): number {
  return Math.max(0, scrollSize - clientSize - scrollPos);
}

/** Whether the current end-distance is within the trigger threshold. Pure for testing. */
export function isWithinEndZone(distanceFromEnd: number, threshold: number): boolean {
  return distanceFromEnd <= threshold;
}

/**
 * Exposes live scroll geometry of its host (or of an external
 * {@link JigScrollAmount.container}) as signals, and fires
 * {@link JigScrollAmount.endReached} when the user scrolls near the bottom.
 *
 * Geometry is resynced whenever the container resizes or the host's content
 * grows, so `distanceFromEnd` stays correct after the list changes.
 *
 * @category directive
 */
@Directive({
  selector: '[jigScrollAmount]',
})
export class JigScrollAmount {
  private readonly _el = inject<ElementRef<HTMLElement>>(ElementRef);

  /**
   * Optional external scroll container. When set, scroll events and
   * dimensions are tracked on this element instead of the host element.
   * @alias jigScrollAmountContainer
   */
  public readonly container = input<HTMLElement | undefined>(undefined, {
    alias: 'jigScrollAmountContainer',
  });

  /**
   * Distance (px) from the end at which {@link endReached} fires.
   * @default 0
   * @alias jigScrollAmountEndThreshold
   */
  public readonly endThreshold = input(0, { alias: 'jigScrollAmountEndThreshold' });

  /**
   * Fires once when scrolling crosses within {@link endThreshold} of the bottom
   * (edge-triggered). For simple "load more" lists; guarded consumers should
   * read {@link distanceFromEnd} instead.
   */
  public readonly endReached = output<void>();

  /** The element actually being observed — {@link container} when set, otherwise the host. */
  public readonly scrollTarget = computed(() => this.container() ?? this._el.nativeElement);
  /** Current vertical scroll offset (px) of the {@link scrollTarget}. */
  public readonly scrollTop = signal(this._el.nativeElement.scrollTop);
  /**
   * How far the {@link scrollTarget} is scrolled from its inline-start edge (px).
   *
   * Always positive: browsers report a negative `scrollLeft` in RTL (0 at the
   * inline-start edge, decreasing toward the inline-end), so the raw value is
   * normalized here rather than at every call site.
   */
  public readonly scrollInlineStart = signal(Math.abs(this._el.nativeElement.scrollLeft));

  private readonly _containerSize = elementSizeSignal(this.scrollTarget);
  private readonly _hostSize = elementSizeSignal(this._el);

  /** Total scrollable height (px) of the {@link scrollTarget}. */
  public readonly scrollHeight = signal(this._el.nativeElement.scrollHeight);
  /** Visible height (px) of the {@link scrollTarget}. */
  public readonly clientHeight = signal(this._el.nativeElement.clientHeight);
  /** Total scrollable width (px) of the {@link scrollTarget}. */
  public readonly scrollWidth = signal(this._el.nativeElement.scrollWidth);
  /** Visible width (px) of the {@link scrollTarget}. */
  public readonly clientWidth = signal(this._el.nativeElement.clientWidth);

  /** Remaining vertical scroll distance to the bottom (px), clamped at 0. */
  public readonly distanceFromEnd = computed(() =>
    computeDistanceFromEnd(this.scrollHeight(), this.clientHeight(), this.scrollTop())
  );
  /** Remaining horizontal scroll distance to the inline-end edge (px), clamped at 0. */
  public readonly distanceFromInlineEnd = computed(() =>
    computeDistanceFromEnd(this.scrollWidth(), this.clientWidth(), this.scrollInlineStart())
  );

  private readonly _scrollEvent = domEventObservable(this.scrollTarget, 'scroll');

  /** Syncs the vertical scroll-size signals. */
  private _syncVerticalGeometry(target: HTMLElement): void {
    this.scrollHeight.set(target.scrollHeight);
    this.clientHeight.set(target.clientHeight);
  }

  /** Syncs all four scroll-geometry signals off `target`. */
  private _syncGeometry(target: HTMLElement): void {
    this._syncVerticalGeometry(target);
    this.scrollWidth.set(target.scrollWidth);
    this.clientWidth.set(target.clientWidth);
  }

  constructor() {
    afterRenderEffect(() => {
      const obs = this._scrollEvent.pipe(
        map(e => {
          const target = e.target as HTMLElement;
          return { top: target.scrollTop, inlineStart: Math.abs(target.scrollLeft), el: target };
        })
      );
      obs.subscribe(scroll => {
        this.scrollTop.set(scroll.top);
        this.scrollInlineStart.set(scroll.inlineStart);
        this._syncVerticalGeometry(scroll.el);
      });
    });

    // Resync geometry on container resize or host content growth.
    afterRenderEffect(() => {
      this._containerSize();
      this._hostSize();
      this._syncGeometry(this.scrollTarget());
    });

    let wasInZone = false;
    effect(() => {
      const inZone = isWithinEndZone(this.distanceFromEnd(), this.endThreshold());
      if (inZone && !wasInZone) this.endReached.emit();
      wasInZone = inZone;
    });
  }
}
