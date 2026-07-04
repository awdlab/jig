import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  inject,
  Injectable,
  type OnDestroy,
  signal,
} from '@angular/core';
import { Platform } from '@ngneers/controls/api/ng';
import { NgnError } from '@ngneers/controls/utils';
import { injectOrThrow } from '@ngneers/controls/utils-ng';

import { DEFAULT_SNACKBAR_OPTIONS } from './defaults';
import { NGN_SNACKBAR_USER_DEFAULTS } from './provider';
import { NgnSnackbarHost } from './snackbar-host';

import type { NgnSnackbarOptions } from './types';

type SnackbarFull = NgnSnackbarOptions & { id: number };

@Injectable()
export class NgnSnackbarManager implements OnDestroy {
  private readonly _snackbars = signal<SnackbarFull[]>([]);
  private readonly _appRef = inject(ApplicationRef);
  private readonly _userDefaults = injectOrThrow(
    NGN_SNACKBAR_USER_DEFAULTS,
    'NgnSnackbarManager',
    'Failed to inject NGN_SNACKBAR_USER_DEFAULTS, make sure to use withSnackbars() to provide ngn snackbars!'
  );
  private _nextId = 0;

  public readonly snackbars = this._snackbars.asReadonly();
  private _component?: ComponentRef<NgnSnackbarHost>;

  constructor() {
    if (!inject(Platform).isBrowser) {
      return;
    }
    // Defer creation to avoid issues with Angular's injection tree during app initialization
    queueMicrotask(() => {
      // Create and attach the snackbar host component to the application's root
      this._component = createComponent(NgnSnackbarHost, {
        environmentInjector: this._appRef.injector,
      });
      this._appRef.attachView(this._component.hostView);
      const hostEl = this._component.location.nativeElement as HTMLElement;
      const appRootEl = this._appRef.components[0]?.location.nativeElement as
        undefined | HTMLElement;
      if (!appRootEl) {
        throw new NgnError(
          'NgnSnackbarManager',
          'Failed to find application root element to attach snackbar host!'
        );
      }
      appRootEl.appendChild(hostEl);
    });
  }

  public ngOnDestroy(): void {
    if (this._component) {
      this._appRef.detachView(this._component.hostView);
      this._component.destroy();
      this._component = undefined;
    }
  }

  public removeSnackbar(id: number): void {
    this._snackbars.update(snackbars => snackbars.filter(t => t.id !== id));
  }

  public addSnackbar(options: NgnSnackbarOptions): number {
    const id = this._nextId++;
    const snackbar: SnackbarFull = {
      ...DEFAULT_SNACKBAR_OPTIONS,
      ...this._userDefaults,
      ...options,
      id,
    };
    this._snackbars.update(snackbars => [...snackbars, snackbar]);
    return id;
  }
}
