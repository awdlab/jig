import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  ActivatedRouteSnapshot,
  PRIMARY_OUTLET,
  RouterStateSnapshot,
  TitleStrategy,
} from '@angular/router';

@Injectable({ providedIn: 'root' })
export class CustomTitleStrategy extends TitleStrategy {
  private readonly _title = inject(Title);

  public updateTitle(snapshot: RouterStateSnapshot): void {
    const title = this.buildTitle(snapshot) || '';

    this._title.setTitle(title);
  }

  public override buildTitle(snapshot: RouterStateSnapshot): string | undefined {
    const pageTitles: string[] = [];
    let route: ActivatedRouteSnapshot | undefined = snapshot.root;

    while (route !== undefined) {
      if (route.routeConfig?.title) {
        pageTitles.unshift(this.getResolvedTitleForRoute(route));
      }

      route = route.children.find(child => child.outlet === PRIMARY_OUTLET);
    }

    // Remove duplicates
    const paths = Array.from(new Set(pageTitles.filter(Boolean)));
    if (paths.length > 1) {
      paths.pop();
    }
    paths.reverse();
    if (!paths.length) {
      return 'ngn-controls';
    }
    return `${paths.join(' - ')} - ngn-controls`;
  }
}
