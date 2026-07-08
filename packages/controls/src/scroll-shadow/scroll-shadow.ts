import { afterNextRender, Directive, ElementRef, inject, Injector, input } from '@angular/core';
import { scrollShadowDirectiveTemplate } from '@ngneers/controls-themes/templates/api';

import { abortSignalOnDestroy, injectThemeTemplate } from '@ngneers/controls/api/ng';
import { toggleClass } from '@ngneers/controls/utils';

@Directive({
  selector: '[ngnScrollShadow]',
})
export class NgnScrollShadow {
  protected readonly theme = injectThemeTemplate(scrollShadowDirectiveTemplate);
  private readonly _el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly _injector = inject(Injector);

  /**
   * Which scroll axis to track and add shadow classes for.
   * @default 'horizontal'
   */
  public readonly ngnScrollShadow = input<'horizontal' | 'vertical' | 'both'>('horizontal');

  /**
   * Element that receives the shadow classes. Defaults to the host element (which
   * is also the scroll container being observed).
   * @default undefined
   */
  public readonly scrollShadowTarget = input<HTMLElement | undefined>(undefined);

  constructor() {
    afterNextRender(() => {
      const scrollEl = this._el.nativeElement;
      const abort = abortSignalOnDestroy({ injector: this._injector });

      const update = () => {
        const target = this.scrollShadowTarget() ?? scrollEl;
        const dir = this.ngnScrollShadow();

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
      abort.addEventListener('abort', () => ro.disconnect());
      scrollEl.addEventListener('scroll', update, { passive: true, signal: abort });
    });
  }
}
