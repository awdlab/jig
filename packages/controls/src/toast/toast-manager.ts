import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  inject,
  Injectable,
  OnDestroy,
  signal,
} from '@angular/core';
import { Platform } from '@ngneers/controls/api/ng';

import { DEFAULT_TOAST_OPTIONS } from './defaults';
import { NgnToastHost } from './toast-host';
import { NgnToastOptions } from './types';

type ToastFull = NgnToastOptions & { id: number };

@Injectable()
export class NgnToastManager implements OnDestroy {
  private readonly _toasts = signal<ToastFull[]>([]);
  private readonly _appRef = inject(ApplicationRef);
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
      const appRootEl = this._appRef.components[0].location.nativeElement as HTMLElement;

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
    const toast: ToastFull = { ...DEFAULT_TOAST_OPTIONS, ...options, id };
    this._toasts.update(toasts => [...toasts, toast]);
    return id;
  }
}
