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

import { DEFAULT_TOAST_OPTIONS } from './defaults';
import { NGN_TOAST_USER_DEFAULTS } from './provider';
import { NgnToastHost } from './toast-host';

import type { NgnToastOptions } from './types';

type ToastFull = NgnToastOptions & { id: number };

@Injectable()
export class NgnToastManager implements OnDestroy {
  private readonly _toasts = signal<ToastFull[]>([]);
  private readonly _appRef = inject(ApplicationRef);
  private readonly _userDefaults = injectOrThrow(
    NGN_TOAST_USER_DEFAULTS,
    'NgnToastManager',
    'Failed to inject NGN_TOAST_USER_DEFAULTS, make sure to use withToasts() to provide ngn toasts!'
  );
  private _nextId = 0;

  public readonly toasts = this._toasts.asReadonly();
  private _component?: ComponentRef<NgnToastHost>;

  constructor() {
    if (!inject(Platform).isBrowser) {
      return;
    }
    // Defer creation to avoid issues with Angular's injection tree during app initialization
    queueMicrotask(() => {
      // Create and attach the toast host component to the application's root
      this._component = createComponent(NgnToastHost, {
        environmentInjector: this._appRef.injector,
      });
      this._appRef.attachView(this._component.hostView);
      const hostEl = this._component.location.nativeElement as HTMLElement;
      const appRootEl = this._appRef.components[0]?.location.nativeElement as
        undefined | HTMLElement;
      if (!appRootEl) {
        throw new NgnError(
          'NgnToastManager',
          'Failed to find application root element to attach toast host!'
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

  public removeToast(id: number): void {
    this._toasts.update(toasts => toasts.filter(t => t.id !== id));
  }

  public addToast(options: NgnToastOptions): number {
    const id = this._nextId++;
    const toast: ToastFull = { ...DEFAULT_TOAST_OPTIONS, ...this._userDefaults, ...options, id };
    this._toasts.update(toasts => [...toasts, toast]);
    return id;
  }
}
