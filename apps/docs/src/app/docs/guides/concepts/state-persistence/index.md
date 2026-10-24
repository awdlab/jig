Some UI state should survive a reload — the width a user dragged a pane to,
the order they put the panels in. The library persists that kind of state to
`localStorage` or `sessionStorage`, and exposes the same mechanism for your own
controls.

Nothing is persisted unless you give it a key. There is no hidden storage
writing behind your back.

### Persisting a control

Every control that persists state takes the same `storage` config input:
`{ key, kind?, states? }`, backed by `JigStorage`.

```html
<jig-splitter [(layout)]="layout" [storage]="{ key: 'editor-panes' }"> … </jig-splitter>
<jig-table [storage]="{ key: 'people-table', states: ['sort', 'columnSizes'] }"> … </jig-table>
<jig-tree [storage]="{ key: 'file-tree' }"> … </jig-tree>
```

| Field    | Purpose                                                                                                    |
| -------- | ---------------------------------------------------------------------------------------------------------- |
| `key`    | Storage key. **No config, no storage** — this is the opt-in.                                               |
| `kind`   | `'localstorage'`, `'sessionstorage'`, `'cookie'`, or a custom adapter. Defaults to the configured default. |
| `states` | Which slices to persist. Omit for all of them.                                                             |

The slices differ per control: the splitter stores `'layout'`, `'panelOrder'`
and `'panelSizes'`; the table stores `'sort'`, `'filters'`, `'columnOrder'`,
`'columnSizes'`, `'selection'`, `'expandedGroups'` and `'page'`.

Bind the config to a **stable reference** — a class field or a `computed()`.
An object literal written inline in the template is a new config on every
change-detection cycle.

### Choosing a storage kind

| Kind               | Survives                      | Use for                                             |
| ------------------ | ----------------------------- | --------------------------------------------------- |
| `'sessionstorage'` | reloads, within one tab       | transient layout                                    |
| `'localstorage'`   | browser restarts, across tabs | a preference the user expects to keep — the default |
| `'cookie'`         | browser restarts, across tabs | state the **server render** must also see           |

`'cookie'` is the only kind readable during server rendering, so it is the one
that avoids a layout shift after hydration.

Set the default once instead of per control:

```ts
provideJigControls({
  theme: { preset: nova },
  defaults: { stateStorage: 'sessionstorage' },
});
```

### Custom storage

Pass an adapter instead of a built-in kind to put the state anywhere — a
backend, an IndexedDB wrapper, a signal you own:

```ts
protected readonly storage = {
  key: 'editor-panes',
  kind: {
    initialize: () => this.preferences().panes ?? {},
    update: (value: Record<string, unknown>) => this.savePreferences({ panes: value }),
  },
};
```

### Keys are yours to make unique

A key is a plain string in a flat namespace shared with everything else on the
origin. Two splitters with the same key restore each other's state; a key that
collides with your own storage will be overwritten.

Namespace them, and include anything that makes the state instance-specific:

```html
<jig-splitter [storage]="paneStorage()" />
```

```ts
protected readonly paneStorage = computed(() => ({
  key: `workspace/${this.workspaceId()}/panes`,
}));
```

Changing the key at runtime loads the state for the new key — which is how you
get per-user or per-document layouts.

### Persisting your own state

`registerStorage` is the primitive every persisting control is built on, exported
from `@awdlab/jig/api/ng`. Call it in an injection context and describe your state
as named **slices**:

```ts
import { registerStorage } from '@awdlab/jig/api/ng';

type PaneState = 'layout' | 'sizes';

export class Editor {
  public readonly storage = input<JigStorageConfig<PaneState> | null>(null);

  private readonly _storage = registerStorage<PaneState>({
    config: this.storage,
    debounce: 100,
    slices: {
      layout: {
        value: () => this.layout(),
        restore: stored => this.layout.set(stored as Layout),
      },
      sizes: {
        value: () => this.sizes(),
        skipWrite: value => !Object.keys(value as object).length,
        restore: stored => this.sizes.set(stored as Sizes),
      },
    },
  });

  public ngOnInit(): void {
    this._storage.restore();
  }
}
```

A slice's name is both the key it is stored under and the token a consumer lists
in `states` — so the `states` filter needs no code of yours.

| Slice member | Purpose                                                                                      |
| ------------ | -------------------------------------------------------------------------------------------- |
| `value`      | The value to persist, read **reactively** — this is what makes the save effect re-run.       |
| `restore`    | Applies a stored value. Receives `unknown`, so narrow it: the payload is whatever was saved. |
| `skipWrite`  | Optional. Return `true` to skip this cycle — mid-drag, or not yet populated.                 |

| Option      | Purpose                                                                        |
| ----------- | ------------------------------------------------------------------------------ |
| `config`    | Your `storage` input. Nullish means nothing is persisted — this is the opt-in. |
| `debounce`  | Milliseconds to coalesce writes. Omit to write synchronously.                  |
| `onSave`    | Inspect or adjust the record about to be written. Mutate in place.             |
| `onRestore` | Inspect or adjust restored values before they are applied. Mutate in place.    |

`restore()` on the returned handle is idempotent per key. Calling it from
`ngOnInit` restores before the first render, which is what lets the `'cookie'`
kind feed the server render. Leave it out and the restore happens after the first
render instead — which is what a control whose state lives in its projected
children has to wait for anyway. Changing the key at runtime re-restores.

The last pending write is flushed on destroy, so a user who drags a divider and
immediately navigates away does not lose it.

#### The storage primitive

Under it sits `JigStorage`, usable on its own when the slice model does not fit:

```ts
import { JigStorage } from '@awdlab/jig/api/ng';

const storage = new JigStorage<{ layout: Layout }>('editor-panes', 'localstorage', {
  layout: defaultLayout,
});

this.layout.set(storage.get('layout') ?? defaultLayout);
storage.set('layout', this.layout());
```

Reads fall back to the initial value when the stored JSON is missing or
unparseable, and writes are no-ops on the server, so neither corrupt data nor
server rendering can throw. Construct it in an injection context — the built-in
kinds read the platform, and `'cookie'` reads the document or the SSR request.

### Server-side rendering

`localStorage` and `sessionStorage` do not exist on the server, so `JigStorage`
no-ops there: the server renders the control's **default** state and the stored
state is applied after hydration.

The `'cookie'` kind is the exception — it reads the request's `Cookie` header
during SSR, so the server render already matches what the browser restores.

For a persisted layout that means a visible adjustment on first paint. Where
that matters, render the container with a neutral placeholder until hydration
rather than trying to guess the stored value on the server. See
[SSR & Hydration](/guides/ssr-hydration).

### Storage failures

Storage can be unavailable — Safari private mode, a blocked third-party
context, a full quota. Treat persisted state as a nice-to-have: never depend on
it being there, and make sure the default state is a sensible one.

Stored values are JSON. `JigStorage` falls back to the initial value when the
payload does not parse, but it cannot tell a _valid_ payload of the wrong shape
from a current one — so after a shape change in your own app, validate what you
read back rather than trusting it.
