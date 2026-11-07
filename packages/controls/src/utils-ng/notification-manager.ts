import { isPlatformBrowser } from '@angular/common';
import {
  ApplicationRef,
  createComponent,
  DestroyRef,
  inject,
  type InjectionToken,
  PLATFORM_ID,
  type Provider,
  signal,
  type Type,
} from '@angular/core';
import { JigError } from '@awdlab/jig/utils';

import { injectOrThrow } from './inject';

/** A queued notification: its options plus an id unique within its manager. */
export type NotificationEntry<T> = T & { id: number };

/** Handle returned when a notification is shown. */
export type NotificationRef = {
  hide: () => void;
};

/** Holds a stack of notifications and mounts the host component that renders them onto the app root. */
export abstract class NotificationManager<T extends object> {
  private readonly _appRef = inject(ApplicationRef);
  private readonly _items = signal<NotificationEntry<T>[]>([]);
  private readonly _defaults: T;
  private _nextId = 0;

  /** The notifications currently shown, oldest first. */
  public readonly items = this._items.asReadonly();

  /**
   * @param name Manager name used in error messages.
   * @param host Component rendering {@link items}, attached to the application root.
   * @param defaults Built-in options, overridden by the user defaults and then the per-call options.
   * @param userDefaults Token holding the app-wide defaults from the `with*()` provider.
   * @param missingProvider Error message thrown when {@link userDefaults} is not provided.
   */
  protected constructor(
    name: string,
    host: Type<unknown>,
    defaults: T,
    userDefaults: InjectionToken<Partial<T>>,
    missingProvider: string
  ) {
    this._defaults = { ...defaults, ...injectOrThrow(userDefaults, name, missingProvider) };
    if (!isPlatformBrowser(inject(PLATFORM_ID))) {
      return;
    }
    const destroyRef = inject(DestroyRef);
    // Deferred so the host is not created while the app's injector tree is still initializing.
    queueMicrotask(() => {
      if (destroyRef.destroyed) {
        return;
      }
      const component = createComponent(host, { environmentInjector: this._appRef.injector });
      this._appRef.attachView(component.hostView);
      destroyRef.onDestroy(() => {
        this._appRef.detachView(component.hostView);
        component.destroy();
      });
      const appRootEl = this._appRef.components[0]?.location.nativeElement as
        | undefined
        | HTMLElement;
      if (!appRootEl) {
        throw new JigError(name, 'Failed to find application root element to attach the host!');
      }
      appRootEl.appendChild(component.location.nativeElement as HTMLElement);
    });
  }

  /** Shows a notification and returns its id. */
  public add(options: T): number {
    const id = this._nextId++;
    this._items.update(items => [...items, { ...this._defaults, ...options, id }]);
    return id;
  }

  /** Removes the notification with the given id. */
  public remove(id: number): void {
    this._items.update(items => items.filter(item => item.id !== id));
  }
}

/** Shows notifications through a {@link NotificationManager}. */
export abstract class NotificationCreator<T extends object> {
  private readonly _manager: NotificationManager<T>;

  constructor(manager: NotificationManager<T>) {
    this._manager = manager;
  }

  /** Shows a notification and returns a handle to hide it again. */
  public show(options: T): NotificationRef {
    const id = this._manager.add(options);
    return {
      hide: () => this._manager.remove(id),
    };
  }
}

/** Providers for a notification manager and the token holding its app-wide defaults. */
export function provideNotifications<T>(
  manager: Type<unknown>,
  userDefaults: InjectionToken<T>,
  defaultOptions: T | undefined
): Provider[] {
  return [manager, { provide: userDefaults, useValue: defaultOptions || {} }];
}
