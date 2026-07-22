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
import { domEventObservable, elementSizeSignal } from '@ngneers/controls/api/ng';
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

@Directive({
  selector: '[ngnScrollAmount]',
})
export class NgnScrollAmount {
  private readonly _el = inject<ElementRef<HTMLElement>>(ElementRef);

  /**
   * Optional external scroll container. When set, scroll events and
   * dimensions are tracked on this element instead of the host element.
   */
  public readonly container = input<HTMLElement | undefined>(undefined, {
    alias: 'ngnScrollAmountContainer',
  });

  /**
   * Distance (px) from the end at which {@link endReached} fires.
   * @default 0
   */
  public readonly endThreshold = input(0, { alias: 'ngnScrollAmountEndThreshold' });

  /**
   * Fires once when scrolling crosses within {@link endThreshold} of the bottom
   * (edge-triggered). For simple "load more" lists; guarded consumers should
   * read {@link distanceFromEnd} instead.
   */
  public readonly endReached = output<void>();

  public readonly scrollTarget = computed(() => this.container() ?? this._el.nativeElement);
  public readonly scrollTop = signal(this._el.nativeElement.scrollTop);
  public readonly scrollLeft = signal(this._el.nativeElement.scrollLeft);

  private readonly _containerSize = elementSizeSignal(this.scrollTarget);
  private readonly _hostSize = elementSizeSignal(this._el);

  public readonly scrollHeight = signal(this._el.nativeElement.scrollHeight);
  public readonly clientHeight = signal(this._el.nativeElement.clientHeight);
  public readonly scrollWidth = signal(this._el.nativeElement.scrollWidth);
  public readonly clientWidth = signal(this._el.nativeElement.clientWidth);

  /** Remaining vertical scroll distance to the bottom (px), clamped at 0. */
  public readonly distanceFromEnd = computed(() =>
    computeDistanceFromEnd(this.scrollHeight(), this.clientHeight(), this.scrollTop())
  );
  /** Remaining horizontal scroll distance to the right edge (px), clamped at 0. */
  public readonly distanceFromRight = computed(() =>
    computeDistanceFromEnd(this.scrollWidth(), this.clientWidth(), this.scrollLeft())
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
          return { top: target.scrollTop, left: target.scrollLeft, el: target };
        })
      );
      obs.subscribe(scroll => {
        this.scrollTop.set(scroll.top);
        this.scrollLeft.set(scroll.left);
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
