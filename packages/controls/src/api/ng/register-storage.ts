import {
  afterRenderEffect,
  DestroyRef,
  effect,
  inject,
  Injector,
  runInInjectionContext,
  untracked,
} from '@angular/core';

import { JIG_CONFIG } from './config';
import { JigStorage, type JigStorageKind } from './storage';

/**
 * One named piece of persisted state. The name is both the key it is stored
 * under and the token a consumer lists in the config's `states`.
 */
export type JigStorageSlice = {
  /**
   * The value to persist, read reactively — the save effect re-runs whenever a
   * signal read here changes. `stored` is the value currently in the store, for
   * slices that merge rather than replace (e.g. sizes of panels not rendered now).
   */
  value: (stored?: unknown) => unknown;
  /** Applies a restored value. Receives whatever was stored, so narrow it. */
  restore: (stored: unknown) => void;
  /** Return `true` to skip persisting this cycle — mid-drag, not yet populated, … */
  skipWrite?: (value: unknown) => boolean;
};

/** The `storage` input every persisting control takes. `S` is its slice vocabulary. */
export type JigStorageConfig<S extends string> = {
  /** The storage key under which the state is saved. */
  key: string;
  /**
   * Where/how to persist. Accepts `'localstorage'`, `'sessionstorage'`, `'cookie'`,
   * or a custom `{ initialize, update }` adapter. Defaults to the configured
   * `defaults.stateStorage`.
   */
  kind?: JigStorageKind<Record<string, unknown>>;
  /** Which slices to persist. When omitted, all of them are saved. */
  states?: readonly S[];
};

export type RegisterStorageOptions<S extends string> = {
  /** The control's `storage` input. Nullish means nothing is persisted. */
  config: () => JigStorageConfig<S> | null | undefined;
  slices: { [K in S]: JigStorageSlice };
  /** Inspect or adjust the values about to be written. Mutate the record in place. */
  onSave?: (values: Partial<Record<S, unknown>>) => void;
  /** Inspect or adjust restored values before they are applied. Mutate in place. */
  onRestore?: (values: Partial<Record<S, unknown>>) => void;
  /** Milliseconds to coalesce writes. Omit to write synchronously. */
  debounce?: number;
  injector?: Injector;
};

export type JigStorageRegistration = {
  /**
   * Creates the store and restores what it holds. Idempotent per key.
   *
   * Call it from `ngOnInit` to restore before the first render, which is what
   * lets the `cookie` kind feed the server render without an NG0100. Otherwise
   * it runs after the first render on its own — which is what a control whose
   * state lives in projected children has to wait for anyway.
   */
  restore(): void;
};

/**
 * Wires a control's state to {@link JigStorage}: creates the store once the
 * `storage` config arrives, restores each enabled slice, and writes slices back
 * as their signals change.
 *
 * Must be called in an injection context, or given an `injector`.
 */
export function registerStorage<S extends string>(
  options: RegisterStorageOptions<S>
): JigStorageRegistration {
  const { config, slices, onSave, onRestore, debounce } = options;
  const injector = options.injector ?? inject(Injector);
  const defaultKind = injector.get(JIG_CONFIG).defaults.stateStorage;
  const names = Object.keys(slices) as S[];
  const slice = (name: S) => slices[name];

  let storage: JigStorage<Record<string, unknown>> | undefined;
  let storedKey: string | undefined;

  const enabled = (name: S): boolean => {
    const states = untracked(config)?.states;
    return !states || states.includes(name);
  };

  const restore = (): void => {
    const cfg = untracked(config);
    if (!cfg || storedKey === cfg.key) {
      return;
    }
    const initial: Record<string, unknown> = {};
    for (const name of names) {
      initial[name] = untracked(() => slice(name).value());
    }
    // JigStorage reads platform/document/request tokens, so it needs an injection context.
    const store = runInInjectionContext(
      injector,
      () => new JigStorage<Record<string, unknown>>(cfg.key, cfg.kind ?? defaultKind, initial)
    );
    storage = store;
    storedKey = cfg.key;

    const values: Partial<Record<S, unknown>> = {};
    for (const name of names) {
      if (!enabled(name)) {
        continue;
      }
      const stored = store.get(name);
      if (stored !== undefined) {
        values[name] = stored;
      }
    }
    if (!Object.keys(values).length) {
      return;
    }
    onRestore?.(values);
    for (const name of names) {
      if (values[name] !== undefined) {
        slice(name).restore(values[name]);
      }
    }
  };

  runInInjectionContext(injector, () => {
    // Picks up a config bound after init, and re-stores when the key changes.
    // After render, so a control whose state lives in its projected children
    // (the splitter's panels) has them to restore into.
    afterRenderEffect(() => {
      config();
      untracked(restore);
    });

    let timer: ReturnType<typeof setTimeout> | undefined;
    let pending: (() => void) | undefined;
    const flush = (): void => {
      clearTimeout(timer);
      timer = undefined;
      pending?.();
      pending = undefined;
    };

    effect(() => {
      // Tracked: this is what makes the effect re-run when the state moves. The
      // previously stored value is read untracked, or writing it would loop.
      const values: Partial<Record<S, unknown>> = {};
      for (const name of names) {
        const stored = storage && untracked(() => storage?.get(name));
        values[name] = slice(name).value(stored);
      }
      untracked(() => {
        const store = storage;
        if (!store) {
          return;
        }
        const write = () => {
          pending = undefined;
          onSave?.(values);
          for (const name of names) {
            const value = values[name];
            if (!enabled(name) || value === undefined || slice(name).skipWrite?.(value)) {
              continue;
            }
            store.set(name, value);
          }
        };
        if (!debounce) {
          write();
          return;
        }
        clearTimeout(timer);
        pending = write;
        timer = setTimeout(write, debounce);
      });
    });

    // A drag that ends with the user navigating away still has a write in flight.
    inject(DestroyRef).onDestroy(flush);
  });

  return { restore };
}
