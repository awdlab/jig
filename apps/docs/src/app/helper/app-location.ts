import { inject, Injectable, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppLocation {
  private readonly _router = inject(Router);

  public readonly location = signal<string[]>([]);

  private updateUrl(url: string) {
    const parts = url.split('/').filter(p => p);
    this.location.set(parts);
  }

  constructor() {
    const url = this._router.url;
    this.updateUrl(url);
    this._router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      const url = this._router.url;
      this.updateUrl(url);
    });
  }
}
