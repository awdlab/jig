Some UI state should survive a reload — the width a user dragged a pane to,
the order they put the panels in. The library persists that kind of state to
`localStorage` or `sessionStorage`, and exposes the same mechanism for your own
controls.

Nothing is persisted unless you give it a key. There is no hidden storage
writing behind your back.

### Persisting a control

Today the [Splitter](/components/splitter) is the control that ships with
persistence. Give it a `stateKey` and it remembers:

```html
<ngn-splitter [(layout)]="layout" stateKey="editor-panes" stateStorage="local"> … </ngn-splitter>
```

| Input          | Purpose                                                                |
| -------------- | ---------------------------------------------------------------------- |
| `stateKey`     | Storage key. **Nullish means nothing is stored** — this is the opt-in. |
| `stateStorage` | `'local'` or `'session'`. Defaults to the configured default.          |
| `stateData`    | Which parts to persist: `'layout'`, `'panelOrder'`, `'panelSizes'`.    |

### Choosing local vs session

| Storage     | Survives                      | Use for                               |
| ----------- | ----------------------------- | ------------------------------------- |
| `'session'` | reloads, within one tab       | transient layout — the default        |
| `'local'`   | browser restarts, across tabs | a preference the user expects to keep |

Set the default once instead of per control:

```ts
provideNgnControls({
  theme: { preset: nova },
  defaults: {
    stateStorage: 'local',
    splitter: { stateStorage: 'session' }, // per-control override
  },
});
```

### Keys are yours to make unique

A key is a plain string in a flat namespace shared with everything else on the
origin. Two splitters with the same key restore each other's state; a key that
collides with your own storage will be overwritten.

Namespace them, and include anything that makes the state instance-specific:

```html
<ngn-splitter [stateKey]="'workspace/' + workspaceId() + '/panes'" />
```

Changing the key at runtime loads the state for the new key — which is how you
get per-user or per-document layouts.

### Persisting your own state

`registerState` is the primitive behind it, exported from
`@ngneers/controls/utils-ng`. Call it in an injection context:

```ts
import { registerState } from '@ngneers/controls/utils-ng';

registerState<Layout>({
  storage: () => this.stateStorage(),
  key: () => this.stateKey(),
  valueFn: previous => this.currentLayout(previous),
  onLoad: state => this.applyLayout(state),
  debounce: 100,
});
```

| Option     | Purpose                                                                                  |
| ---------- | ---------------------------------------------------------------------------------------- |
| `storage`  | Which storage to use, read reactively.                                                   |
| `key`      | The storage key, read reactively. Returning nullish disables persistence.                |
| `valueFn`  | Produces the value to store, given the previously stored one. Runs in a reactive effect. |
| `onLoad`   | Called with the restored value on startup; return the value to adopt.                    |
| `debounce` | Milliseconds to coalesce writes. `0` writes synchronously.                               |

Writes are debounced, and also flushed on `beforeunload` and on destroy — so a
user who drags a divider and immediately closes the tab does not lose it.

`loadState` / `saveState` are exported too, if you want the storage helpers
without the effect wiring.

### Server-side rendering

`localStorage` and `sessionStorage` do not exist on the server, so restoration
runs in an `afterRenderEffect` — browser only. The server renders the control's
**default** state and the stored state is applied after hydration.

For a persisted layout that means a visible adjustment on first paint. Where
that matters, render the container with a neutral placeholder until hydration
rather than trying to guess the stored value on the server. See
[SSR & Hydration](/guides/ssr-hydration).

### Storage failures

Storage can be unavailable — Safari private mode, a blocked third-party
context, a full quota. Treat persisted state as a nice-to-have: never depend on
it being there, and make sure the default state is a sensible one.

Stored values are JSON. A shape change between releases of your own app means
old values may not parse into what you expect — validate in `onLoad` and fall
back to the default rather than trusting the payload.
