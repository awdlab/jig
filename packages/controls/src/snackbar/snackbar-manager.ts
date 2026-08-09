import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  inject,
  Injectable,
  type OnDestroy,
  signal,
} from '@angular/core';
import { Platform } from '@awdlab/jig/api/ng';
import { JigError } from '@awdlab/jig/utils';
import { injectOrThrow } from '@awdlab/jig/utils-ng';

import { DEFAULT_SNACKBAR_OPTIONS } from './defaults';
import { JIG_SNACKBAR_USER_DEFAULTS } from './provider';
import { JigSnackbarHost } from './snackbar-host';

import type { JigSnackbarOptions } from './types';

type SnackbarFull = JigSnackbarOptions & { id: number };

@Injectable()
export class JigSnackbarManager implements OnDestroy {
  private readonly _snackbars = signal<SnackbarFull[]>([]);
  private readonly _appRef = inject(ApplicationRef);
  private readonly _userDefaults = injectOrThrow(
    JIG_SNACKBAR_USER_DEFAULTS,
    'JigSnackbarManager',
    'Failed to inject JIG_SNACKBAR_USER_DEFAULTS, make sure to use withSnackbars() to provide jig snackbars!'
  );
  private _nextId = 0;

  public readonly snackbars = this._snackbars.asReadonly();
  private _component?: ComponentRef<JigSnackbarHost>;

  constructor() {
    if (!inject(Platform).isBrowser) {
      return;
    }
    // Defer creation to avoid issues with Angular's injection tree during app initialization
    queueMicrotask(() => {
      // Create and attach the snackbar host component to the application's root
      this._component = createComponent(JigSnackbarHost, {
        environmentInjector: this._appRef.injector,
      });
      this._appRef.attachView(this._component.hostView);
      const hostEl = this._component.location.nativeElement as HTMLElement;
      const appRootEl = this._appRef.components[0]?.location.nativeElement as
        | undefined
        | HTMLElement;
      if (!appRootEl) {
        throw new JigError(
          'JigSnackbarManager',
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

  public addSnackbar(options: JigSnackbarOptions): number {
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
