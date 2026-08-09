import { Location } from '@angular/common';
import { Directive, inject } from '@angular/core';
import { Router } from '@angular/router';

/** A path whose last segment has an extension is a static file, not a route. */
const ASSET_PATH = /\.[a-z0-9]+$/i;

/**
 * Routes clicks on plain `<a href>` links inside dynamically rendered HTML —
 * markdown pages and API comments, which the router never sees. Without it every
 * in-app link reloads the whole app.
 *
 * Same-page anchors, modified clicks and static files (`/llms.txt`, `/md/…`)
 * keep native browser behaviour.
 */
@Directive({
  selector: '[ngnRouteLinks]',
  host: { '(click)': 'onClick($event)' },
})
export class RouteLinks {
  private readonly _router = inject(Router);
  private readonly _location = inject(Location);

  protected onClick(event: MouseEvent): void {
    const link = (event.target as HTMLElement | null)?.closest('a');
    if (
      !link ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      link.target ||
      link.hasAttribute('download')
    ) {
      return;
    }
    const href = link.getAttribute('href');
    if (!href?.startsWith('/')) {
      return;
    }
    const [path, fragment] = href.split('#');
    if (!path || ASSET_PATH.test(path) || path === this._location.path().split('?')[0]) {
      return;
    }
    event.preventDefault();
    void this._router.navigate([path], { fragment: fragment || undefined });
  }
}
