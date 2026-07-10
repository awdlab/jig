The **`@ngneers/controls-mcp`** package is a
[Model Context Protocol](https://modelcontextprotocol.io) server that gives AI
coding agents accurate, first-hand knowledge of `@ngneers/controls` — every
control's API, selector, and usage, plus the concept guides (theming, colors,
passthrough, state, …).

Point Claude Code, Cursor, Windsurf, or any MCP client at it and the agent stops
guessing component names and input signatures.

It provides four capabilities:

1. **Docs / explain** — control APIs, selectors, usage, concept guides.
2. **Theming** — token schema + per-control anatomy + theme-part scaffolds.
3. **Migration** — PrimeNG / Angular Material / Syncfusion → ngn component maps.
4. **Feature dev** — control recommendations + composition recipes.

All layers are **advisory / knowledge-only**: the server returns knowledge and
scaffolds; the host agent makes the file edits.

### How it works

The server is **self-contained and read-only**. At runtime it serves a single
bundled knowledge pack and never touches your repo or the network — which makes
it safe to run via `npx` inside any project.

Its knowledge is **hybrid**:

- **Auto-derived** from the monorepo: control API (TypeDoc), real selectors
  (decorator source), per-control theme anatomy (theme templates), per-theme
  kind/color options, and real usage examples (the docs demos' templates).
- **Hand-authored**: the theme token schema, migration maps, and composition
  recipes — the judgment that can't be derived.

Because the pack is rebuilt whenever controls, docs, or authored knowledge
change, it can never silently drift from the library.

### What it exposes

**Tools** the agent can call:

| Tool                     | Purpose                                                            |
| ------------------------ | ------------------------------------------------------------------ |
| `list_controls`          | Discover every control/directive with selector + one-liner.        |
| `get_control`            | Full reference for one control: inputs/outputs, types, prose docs. |
| `search_docs`            | Ranked keyword search across controls **and** concept guides.      |
| `get_theme_schema`       | Token vocabulary + `createThemePart` authoring API + gotchas.      |
| `get_control_theme`      | A control's themeable anatomy (`c()` classes, `d()` deps).         |
| `scaffold_theme_part`    | Ready-to-edit `createThemePart` skeleton for a control.            |
| `get_theme_options`      | Theme-dependent `kind` / `color` values (per built-in theme).      |
| `list_migration_sources` | Source libraries with a migration map + coverage.                  |
| `map_component`          | One source component → ngn target, with prop/event maps + gaps.    |
| `search_migration`       | Find the ngn equivalent for a source component / feature.          |
| `recommend_controls`     | Suggest controls + recipes for a feature goal.                     |

**Resources** (browsable, addressable): `ngn://control/<name>`,
`ngn://concept/<slug>`, `ngn://recipe/<slug>`, and `ngn://example/<slug>` (real,
compiled usage snippets auto-derived from the docs demos).

**Prompts** (surfaced as slash-commands / quick actions where supported):
`explain_control`, `explain_concept`, `author_theme`, `migrate_library`, and
`build_feature` — each returns a ready-made request with the relevant reference
inlined.

### Using it in a client

No install step is needed — clients run the server via `npx`.

**Claude Code** (`.mcp.json` in your project, or user settings):

```json
{
  "mcpServers": {
    "ngn-controls": {
      "command": "npx",
      "args": ["-y", "@ngneers/controls-mcp"]
    }
  }
}
```

**Cursor** (`.cursor/mcp.json`) and **Windsurf** use the same `mcpServers`
shape. Any MCP-capable client works — the server is client-agnostic.

### Next steps

- [Agent Skills](/guides/skills) — procedural guides that teach an agent _how_
  to use these tools for a task.
