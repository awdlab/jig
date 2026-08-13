import { Component, computed, input } from '@angular/core';
import { JigBase, provideSelf } from '@awdlab/jig/base';
import { skeletonControlTemplate } from '@awdlab/jig-themes/templates/skeleton';

/**
 * Shape of a skeleton placeholder. `rect` is sized with
 * {@link JigSkeleton.width} / {@link JigSkeleton.height}, `circle` with
 * {@link JigSkeleton.diameter}.
 */
export type SkeletonShape = 'rect' | 'circle';

/** Numbers are treated as pixels, strings are passed through as CSS lengths. */
function cssLength(value: number | string): string {
  return typeof value === 'number' ? `${value}px` : value;
}

/**
 * @category control
 */
@Component({
  selector: 'jig-skeleton',
  template: '',
  providers: [provideSelf(JigSkeleton)],
  host: {
    'aria-hidden': 'true',
    '[style.--width]': 'cssWidth()',
    '[style.--height]': 'cssHeight()',
    '[style.--radius]': 'cssRadius()',
    '[style.--inset]': 'cssInset()',
  },
})
export class JigSkeleton extends JigBase<'skeleton'> {
  protected readonly theme = this.injectThemeTemplate(skeletonControlTemplate, 'root');

  /**
   * Whether the placeholder is a rectangle or a circle. The shape decides which
   * dimension inputs apply.
   * @default 'rect'
   */
  public readonly shape = input<SkeletonShape>('rect');
  /**
   * Width of a `rect` skeleton. A number is pixels, a string is any CSS length.
   * Ignored when {@link shape} is `circle`.
   * @default 100%
   */
  public readonly width = input<number | string>('100%');
  /**
   * Height of a `rect` skeleton. A number is pixels, a string is any CSS length.
   * Defaults to one line of text, so a bare skeleton reads as a text placeholder.
   * Ignored when {@link shape} is `circle`.
   * @default 1lh
   */
  public readonly height = input<number | string>('1lh');
  /**
   * Corner radius of a `rect` skeleton, falling back to the theme's default.
   * Ignored when {@link shape} is `circle`, which is always fully rounded.
   */
  public readonly radius = input<number | string>();
  /**
   * Diameter of a `circle` skeleton, driving both width and height. Ignored when
   * {@link shape} is `rect`.
   * @default 1lh
   */
  public readonly diameter = input<number | string>('1lh');

  private readonly isCircle = computed(() => this.shape() === 'circle');

  protected readonly cssWidth = computed(() =>
    cssLength(this.isCircle() ? this.diameter() : this.width())
  );
  protected readonly cssHeight = computed(() =>
    cssLength(this.isCircle() ? this.diameter() : this.height())
  );
  protected readonly cssRadius = computed(() => {
    if (this.isCircle()) {
      return '50%';
    }
    const radius = this.radius();
    return radius === undefined ? null : cssLength(radius);
  });

  // Vertical breathing room painted inside the box, so stacked lines separate without
  // growing the layout. Circles keep their exact diameter — an inset would squash them.
  protected readonly cssInset = computed(() => (this.isCircle() ? '0px' : '2px'));
}
