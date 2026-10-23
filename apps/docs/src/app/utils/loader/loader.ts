import { Component, computed, input } from '@angular/core';
import { JigSpinner } from '@awdlab/jig/spinner';

/** Docs loading indicator: the jig mark pulsing inside a spinner ring. */
@Component({
  selector: 'jig-docs-loader',
  imports: [JigSpinner],
  template: `
    <div class="grid place-items-center *:[grid-area:1/1]">
      <jig-spinner [size]="size()" [thickness]="thickness()" />
      <img
        src="img/logo.png?v=4"
        alt=""
        class="jig-motion-cosmetic animate-pulse"
        [width]="markSize()"
        [height]="markSize()"
        [style.width.px]="markSize()"
        [style.height.px]="markSize()"
      />
    </div>
  `,
  host: {
    role: 'status',
    'aria-label': 'Loading',
    class: 'inline-grid place-items-center',
  },
})
export class JigDocsLoader {
  /**
   * Diameter of the ring in pixels.
   * @default 64
   */
  public readonly size = input(64);
  /** Stroke width of the ring as a CSS length; falls back to the theme default. */
  public readonly thickness = input<string>();

  protected readonly markSize = computed(() => Math.round(this.size() * 0.5));
}
