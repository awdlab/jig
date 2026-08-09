import { Directive } from '@angular/core';

/**
 * Mouse-follow glow for bento tiles: keeps `--awd-glow-x/y` in sync with the
 * pointer so the `.awd-glow-card` overlay's radial highlight tracks it.
 */
@Directive({
  selector: '[ngnDocsGlow]',
  host: {
    class: 'awd-glow-card',
    '(mousemove)': 'onMove($event)',
  },
})
export class NgnDocsGlow {
  protected onMove(event: MouseEvent): void {
    const el = event.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--awd-glow-x', `${event.clientX - rect.left}px`);
    el.style.setProperty('--awd-glow-y', `${event.clientY - rect.top}px`);
  }
}
