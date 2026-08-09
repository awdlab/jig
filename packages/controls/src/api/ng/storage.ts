import { isPlatformBrowser } from '@angular/common';
import {
  DOCUMENT,
  inject,
  PLATFORM_ID,
  REQUEST,
  signal,
  untracked,
  type WritableSignal,
} from '@angular/core';
import { Logger } from '@awdlab/jig/utils';

export type JigStorageKind<T> =
  | 'localstorage'
  | 'sessionstorage'
  | 'cookie'
  | {
      initialize: () => T;
      update: (value: T) => void;
    };

/** One year, in seconds — used as the cookie `max-age`. */
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export class JigStorage<T extends Record<string, unknown>> {
  private readonly _store: WritableSignal<T>;
  private readonly _set: (value: T) => void;

  public set<K extends keyof T>(key: K, value: T[K]) {
    untracked(() => {
      const newVal = {
        ...this._store(),
        [key]: value,
      };
      this._store.set(newVal);
      this._set(newVal);
    });
  }

  public get<K extends keyof T>(key: K): T[K] | undefined {
    return this._store()[key];
  }

  /**
   * NOTE: must be constructed within an injection context — the built-in kinds
   * read the platform (`PLATFORM_ID`) to stay SSR-safe, and the `cookie` kind
   * additionally reads `DOCUMENT` / the SSR `REQUEST`.
   */
  constructor(key: string, kind: JigStorageKind<T>, initialValue: T) {
    this._store = signal<T>(initialValue);

    // Custom adapter — the caller fully controls persistence.
    if (typeof kind === 'object') {
      this._store.set(kind.initialize() ?? initialValue);
      this._set = kind.update;
      return;
    }

    const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

    // Cookies are the only kind readable during SSR (from the request headers).
    if (kind === 'cookie') {
      const doc = inject(DOCUMENT);
      const cookieString = isBrowser
        ? doc.cookie
        : (inject(REQUEST, { optional: true })?.headers.get('cookie') ?? '');
      this._store.set(this._parse(key, readCookie(cookieString, key), initialValue));
      // Writes only happen in the browser; the server render is read-only.
      this._set = isBrowser
        ? value => {
            const encoded = encodeURIComponent(JSON.stringify(value ?? {}));
            const secure = doc.location?.protocol === 'https:' ? ';secure' : '';
            doc.cookie = `${encodeURIComponent(key)}=${encoded};path=/;max-age=${COOKIE_MAX_AGE};samesite=lax${secure}`;
          }
        : () => {
            /* no-op on the server */
          };
      return;
    }

    // localstorage / sessionstorage are browser-only; no-op (keep the initial
    // value) during SSR so the render doesn't crash.
    if (!isBrowser) {
      this._set = () => {
        /* no-op on the server */
      };
      return;
    }
    const storage = kind === 'localstorage' ? localStorage : sessionStorage;
    this._store.set(this._parse(key, storage.getItem(key), initialValue));
    this._set = (value: T) => storage.setItem(key, JSON.stringify(value ?? {}));
  }

  /** Parse persisted JSON, falling back to the caller's initial value. */
  private _parse(key: string, raw: string | null, fallback: T): T {
    if (!raw) {
      return fallback;
    }
    try {
      return JSON.parse(raw) as T;
    } catch (error) {
      Logger.warn(`Could not parse stored value for key ${key}`, error);
      return fallback;
    }
  }
}

/** Read a single cookie value from a `Cookie` header / `document.cookie` string. */
function readCookie(cookieString: string, key: string): string | null {
  const name = encodeURIComponent(key);
  for (const part of cookieString.split(';')) {
    const separator = part.indexOf('=');
    if (separator === -1) {
      continue;
    }
    if (part.slice(0, separator).trim() === name) {
      return decodeURIComponent(part.slice(separator + 1));
    }
  }
  return null;
}
