import {
  afterNextRender,
  booleanAttribute,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  Injector,
  input,
  Renderer2,
} from '@angular/core';
import { scrollShadowDirectiveTemplate } from '@awdlab/jig-themes/templates/api';

import { domEventHandler, injectThemeTemplate } from '@awdlab/jig/api/ng';
import { toggleClass } from '@awdlab/jig/utils';

/**
 * Fades a scroll edge in and out as its host scrolls, signalling more content.
 *
 * @category directive
 */
@Directive({
  selector: '[jigScrollShadow]',
})
export class JigScrollShadow {
  protected readonly theme = injectThemeTemplate(scrollShadowDirectiveTemplate);
  private readonly _el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly _injector = inject(Injector);
  private readonly _renderer = inject(Renderer2);

  /**
   * Which scroll axis to track and add shadow classes for.
   * @default 'horizontal'
   */
  public readonly jigScrollShadow = input<'horizontal' | 'vertical' | 'both'>('horizontal');

  /**
   * Element that receives the shadow classes. Defaults to the host element (which
   * is also the scroll container being observed).
   * @default undefined
   */
  public readonly scrollShadowTarget = input<HTMLElement | undefined>(undefined);

  /**
   * Suppress the built-in edge-shadow overlay's styling (the theme hides it). The overlay element
   * is still injected but rendered inert, so it never disturbs the scroll container's layout.
   * Set this when the consumer paints its own shadows off the `scrolled-*` classes — e.g. the
   * table anchors them to its sticky-column edges, reusing the shared `--jig-scroll-shadow-color`.
   * @default false
   */
  public readonly unstyled = input(false, {
    alias: 'jigScrollShadowUnstyled',
    transform: booleanAttribute,
  });

  constructor() {
    afterNextRender(() => {
      const scrollEl = this._el.nativeElement;

      // Injected overlay: a zero-size sticky layer pinned to the viewport's top-left corner, with a
      // sized cover inside it. The cover's edge gradients (driven by the theme via the scrolled-*
      // classes) paint over the scrolling content — painting on the container itself would sit
      // *under* its children. When `unstyled`, the theme hides the layer (display:none), so it
      // stays inert and never disturbs the container's layout (e.g. the table's CSS grid).
      const layer = this._renderer.createElement('div') as HTMLElement;
      layer.className = this.unstyled()
        ? `${this.theme.class('overlay')} ${this.theme.class('unstyled')}`
        : this.theme.class('overlay');
      const surface = this._renderer.createElement('div') as HTMLElement;
      surface.className = this.theme.class('surface');
      this._renderer.appendChild(layer, surface);
      this._renderer.insertBefore(scrollEl, layer, scrollEl.firstChild);
      this._injector.get(DestroyRef).onDestroy(() => layer.remove());

      const update = () => {
        const target = this.scrollShadowTarget() ?? scrollEl;
        const dir = this.jigScrollShadow();

        surface.style.setProperty('--jig-scroll-shadow-w', `${scrollEl.clientWidth}px`);
        surface.style.setProperty('--jig-scroll-shadow-h', `${scrollEl.clientHeight}px`);

        if (dir === 'horizontal' || dir === 'both') {
          const sl = scrollEl.scrollLeft;
          const maxH = scrollEl.scrollWidth - scrollEl.clientWidth;
          toggleClass(target, this.theme.class('scrolled-start'), sl > 0);
          toggleClass(target, this.theme.class('scrolled-end'), maxH > 0 && sl < maxH - 1);
        }

        if (dir === 'vertical' || dir === 'both') {
          const st = scrollEl.scrollTop;
          const maxV = scrollEl.scrollHeight - scrollEl.clientHeight;
          toggleClass(target, this.theme.class('scrolled-top'), st > 0);
          toggleClass(target, this.theme.class('scrolled-bottom'), maxV > 0 && st < maxV - 1);
        }
      };

      const ro = new ResizeObserver(update);
      ro.observe(scrollEl);
      this._injector.get(DestroyRef).onDestroy(() => ro.disconnect());
      domEventHandler(scrollEl, 'scroll', update, this._injector, { passive: true });
      update();
    });
  }
}
