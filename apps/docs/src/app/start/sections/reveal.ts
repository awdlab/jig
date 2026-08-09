import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';

/**
 * Scroll-reveal: fades/slides the host in once it enters the viewport.
 *
 * The hiding class is only added at runtime (browser, after first render), so
 * prerendered HTML stays fully visible without JS and there is no flash of
 * hidden content. Respects `prefers-reduced-motion`.
 */
@Directive({ selector: '[ngnDocsReveal]' })
export class JigDocsReveal {
  /** Extra transition delay in ms — use to stagger siblings. */
  public readonly revealDelay = input(0, { alias: 'ngnDocsReveal' });

  constructor() {
    const el = inject(ElementRef).nativeElement as HTMLElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      // Already on screen (above the fold)? Don't hide-then-animate.
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        return;
      }

      el.style.setProperty('--jig-reveal-delay', `${this.revealDelay()}ms`);
      el.classList.add('jig-reveal');

      // The huge top margin keeps elements ABOVE the viewport "intersecting",
      // so content jumped past (anchor links, End key, fast scroll) still
      // reveals instead of staying hidden forever.
      const io = new IntersectionObserver(
        entries => {
          if (entries.some(e => e.isIntersecting)) {
            el.classList.add('jig-reveal-in');
            io.disconnect();
          }
        },
        { rootMargin: '10000px 0px 0px 0px' }
      );
      io.observe(el);
      destroyRef.onDestroy(() => io.disconnect());
    });
  }
}
