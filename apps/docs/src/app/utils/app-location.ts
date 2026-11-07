import { inject, Service, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Service()
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
    this._router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe(() => {
        const url = this._router.url;
        this.updateUrl(url);
      });
  }
}
