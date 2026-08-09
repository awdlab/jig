import {
  Injector,
  DestroyRef,
  inject,
  DOCUMENT,
  signal,
  afterRenderEffect,
  untracked,
  effect,
} from '@angular/core';

export type AwdStateStorage = 'local' | 'session';

export function loadState<T>(storage: AwdStateStorage, key: string) {
  const storageType = storage === 'local' ? localStorage : sessionStorage;
  const state = storageType.getItem(key);
  return state ? (JSON.parse(state) as T) : null;
}

export function saveState<T>(storage: AwdStateStorage, key: string, state: T | null) {
  const storageType = storage === 'local' ? localStorage : sessionStorage;
  if (state === null) {
    storageType.removeItem(key);
    return;
  }
  storageType.setItem(key, JSON.stringify(state));
}

export type RegisterStateOptions<T> = {
  storage: () => AwdStateStorage;
  key: () => string | null | undefined;
  valueFn: (previousState: T | null) => T | null;
  onLoad: (state: T | null) => T | null;
  debounce?: number;
  injector?: Injector;
};
export function registerState<T>(options: RegisterStateOptions<T>) {
  const { storage, key, valueFn, onLoad, debounce } = options;
  const destroyRef = options?.injector?.get(DestroyRef) ?? inject(DestroyRef);
  const document = options?.injector?.get<Document>(DOCUMENT) ?? inject(DOCUMENT);

  const load = () => {
    const k = key();
    return k ? loadState<T>(storage(), k) : null;
  };

  const stateSignal = signal<T | null | undefined>(undefined);

  let timer: ReturnType<typeof setTimeout> | undefined = undefined;
  const save = () => {
    const k = key();
    const s = stateSignal();
    if (k && s !== undefined) saveState(storage(), k, s);
  };

  afterRenderEffect(() => {
    let state = load();
    if (onLoad) {
      state = untracked(() => onLoad(state));
    }
    stateSignal.set(state);
  }, options);
  afterRenderEffect(() => {
    stateSignal.set(valueFn(untracked(() => stateSignal() ?? null)));
  }, options);
  effect(() => {
    stateSignal();
    if (debounce === 0) {
      save();
    } else {
      clearTimeout(timer);
      timer = setTimeout(save, debounce);
    }
  }, options);

  // Ensure saving happens on destroy and unload
  document.defaultView?.addEventListener('beforeunload', save);
  destroyRef.onDestroy(() => {
    clearTimeout(timer);
    document.defaultView?.removeEventListener('beforeunload', save);
    save();
  });
}
