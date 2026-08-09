The library is built for server-side rendering: nothing touches `window` at
construction time, browser-only work is deferred to `afterNextRender` /
`afterRenderEffect`, and a `Platform` service gates the rest.

There are a few things worth understanding, because they shape what your server
HTML contains.

### Styling on the server

Theme CSS is generated and injected into `<head>` as each control scope first
appears — on the server too. The HTML you serve therefore already carries the
CSS for the controls it contains, and there is no unstyled flash on load.

Every control also starts with a `jig-control-initializing` class that hides
it until it has laid out. On the **server** that class is removed immediately,
so the served markup is complete and visible; in the browser it is removed
after the first render. Do not target that class in your own CSS — it exists
purely to prevent a flash.

### Translations

Built-in strings load through a dynamic import. That import is tracked with
Angular's `PendingTasks`, so the server waits for the locale before
serializing — the HTML you serve is translated, not a set of raw key paths.

The initial language is `en`. If you resolve a language per request, set it
during bootstrap; see [i18n](/guides/i18n).

### What does not run on the server

- **Focus.** `jigAutofocus` and every control's focus management are
  `afterNextRender`-based and inert on the server.
- **Pointer gestures.** `jigDrag`, `jigDragScroll`, `jigMovable` and
  `jigResizable` do nothing until hydration.
- **Measurement.** Anything driven by `ResizeObserver` or `getBoundingClientRect`
  — virtual scrolling window size, overlay positioning, scroll geometry —
  reports its initial value until the client measures. Virtualized lists
  therefore render their initial window, not the full data set.
- **Storage.** Persisted UI state (`localStorage` / `sessionStorage`) is not
  available on the server, so state-restoring controls render their default and
  restore after hydration. See [State Persistence](/guides/state-persistence).
- **Overlays.** Dialogs, popovers, menus and tooltips are not open during SSR,
  so their content is not in the server HTML.

### Colour scheme without a flash

`withAutoColorScheme()` reads the stored preference in the browser, which is
too late to prevent a light-then-dark flash. Add the pre-paint script to
`index.html` so the `dark` class is on `<html>` before the first paint — see
[Dark Mode](/guides/dark-mode).

### Writing SSR-safe code around the library

Two failure modes account for almost every SSR bug in an app built on these
primitives.

**1. Untracked async work.** An unawaited dynamic import or promise lets
Angular reach stability and tear the injector down mid-flight, which surfaces
as `NG0205: Injector has already been destroyed`. Wrap async work so the server
waits for it:

```ts
private readonly _pendingTasks = inject(PendingTasks);
private readonly _destroyRef = inject(DestroyRef);

protected load(): void {
  void this._pendingTasks.run(async () => {
    const module = await import('./heavy');
    if (this._destroyed) return; // guard: the injector may be gone
    this._data.set(module.data);
  });
}
```

**2. Moving DOM nodes during creation.** Creating a component and appending its
node somewhere else invalidates hydration's expectation of the DOM shape and
throws `Expecting instance of DOM Element`. Gate that kind of work on the
browser:

```ts
private readonly _isBrowser = inject(Platform).isBrowser;

constructor() {
  if (!this._isBrowser) return;
  // …create and attach…
}
```

`Platform` is exported from `@awdlab/jig/api/ng` and is the idiomatic
check inside this library.

### Hydration

Standard Angular hydration works — no `ngSkipHydration` is required on any
control. If you do hit a mismatch, it is almost always your own markup around
the control (whitespace-sensitive templates, DOM written outside Angular), not
the control itself.

### Checklist

- Serve with `provideClientHydration()` — the controls expect it.
- Keep the colour-scheme pre-paint script in `index.html`.
- Do not read `window`, `document`, `localStorage` or `navigator` outside
  `afterNextRender` / a `Platform.isBrowser` guard.
- Wrap async work that must finish before serialization in `PendingTasks.run`.
- Expect overlays, virtualization windows and persisted state to settle after
  hydration, not before.
