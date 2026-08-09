import { Directive } from '@angular/core';

/**
 * Mouse-follow glow for bento tiles: keeps `--jig-glow-x/y` in sync with the
 * pointer so the `.jig-glow-card` overlay's radial highlight tracks it.
 */
@Directive({
  selector: '[jigDocsGlow]',
  host: {
    class: 'jig-glow-card',
    '(mousemove)': 'onMove($event)',
  },
})
export class JigDocsGlow {
  protected onMove(event: MouseEvent): void {
    const el = event.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--jig-glow-x', `${event.clientX - rect.left}px`);
    el.style.setProperty('--jig-glow-y', `${event.clientY - rect.top}px`);
  }
}
