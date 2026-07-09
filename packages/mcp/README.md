# @ngneers/controls-mcp

A [Model Context Protocol](https://modelcontextprotocol.io) server that gives AI
coding agents accurate, first-hand knowledge of
[`@ngneers/controls`](../controls) — every control's API, selector, and usage,
plus the concept guides (theming, colors, passthrough, state, …).

Point Claude Code, Cursor, Windsurf, or any MCP client at it and the agent stops
guessing component names and input signatures.

Four capabilities:

1. **Docs / explain** — control APIs, selectors, usage, concept guides.
2. **Theming** — token schema + per-control anatomy + theme-part scaffolds.
3. **Migration** — PrimeNG / Angular Material / Syncfusion → ngn component maps.
4. **Feature dev** — control recommendations + composition recipes.

All layers are **advisory / knowledge-only**: the server returns knowledge and
scaffolds; the host agent makes the file edits.

## How it works

The server is **self-contained and read-only**. At runtime it serves a single
bundled JSON — `data/knowledge-pack.json` — and never touches your repo or the
network. That makes it safe to `npx` inside any project.

```
build time (in this monorepo, at publish)      runtime (in a consumer's repo)
┌────────────────────────────────────────┐     ┌──────────────────────────────┐
│ api-docs-gen typedoc.json ─┐            │     │ npx @ngneers/controls-mcp    │
│ components/**/index.md    ─┼─► build-   │ ──► │  (stdio JSON-RPC)            │
│ guides/**/index.md        ─┘   pack.ts  │     │  reads data/knowledge-pack   │
│                              → data/*.json     │  serves resources/tools/     │
└────────────────────────────────────────┘     │  prompts                     │
                                                └──────────────────────────────┘
```

Knowledge is **hybrid**:

- **Auto-derived** from the monorepo: control API (TypeDoc), real selectors
  (decorator source), per-control theme anatomy (theme templates), per-theme
  kind/color options, and real usage examples (the docs demos' templates).
- **Hand-authored** in [`authored/`](./authored): the theme token schema,
  migration maps, and composition recipes — the judgment that can't be derived.

Rebuild the pack whenever controls, docs, or authored knowledge change
(`pnpm build:pack`), so it can never silently drift.

## What it exposes

**Tools** (agent calls these):

| Tool                     | Purpose                                                            |
| ------------------------ | ------------------------------------------------------------------ |
| `list_controls`          | Discover every control/directive with selector + one-liner.        |
| `get_control`            | Full reference for one control: inputs/outputs, types, prose docs. |
| `search_docs`            | Ranked keyword search across controls **and** concept guides.      |
| `get_theme_schema`       | Token vocabulary + `createThemePart` authoring API + gotchas.      |
| `get_control_theme`      | A control's themeable anatomy (`c()` classes, `d()` deps).         |
| `scaffold_theme_part`    | Ready-to-edit `createThemePart` skeleton for a control.            |
| `get_theme_options`      | Theme-dependent `kind`/`color` values (per built-in theme).        |
| `list_migration_sources` | Source libraries with a migration map + coverage.                  |
| `map_component`          | One source component → ngn target, with prop/event maps + gaps.    |
| `search_migration`       | Find the ngn equivalent for a source component/feature.            |
| `recommend_controls`     | Suggest controls + recipes for a feature goal.                     |

**Resources** (browsable, addressable): `ngn://control/<name>`,
`ngn://concept/<slug>`, `ngn://recipe/<slug>`, `ngn://example/<slug>` (real,
compiled usage snippets auto-derived from the docs demos).

**Prompts** (surfaced as slash-commands / quick actions where supported):
`explain_control`, `explain_concept`, `author_theme`, `migrate_library`,
`build_feature` — each returns a ready-made request with the relevant reference
inlined.

## Using it in a client

Once published, no install step is needed — clients run it via `npx`.

**Claude Code** (`.mcp.json` in the consumer's project, or user settings):

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

## Skills

The package also ships agent **skills** under [`skills/`](./skills) — procedural
guides that tell an agent _how_ to use the MCP tools for a task (`ngn-controls`,
`ngn-migrate`, `ngn-theme`, `ngn-build-feature`). Each is a `SKILL.md` with
`name` + `description` frontmatter, the convention used by the
[`skills`](https://github.com/vercel-labs/skills) CLI and compatible installers.

Install them into a project (they compose with the MCP server — skills carry the
procedure, MCP carries the data):

```bash
# From the repo (the skills CLI resolves git repos / subpaths / local paths):
npx skills@latest add https://github.com/<owner>/<repo>/tree/main/packages/mcp/skills

# ...or point at a local checkout / the installed package folder:
npx skills@latest add ./node_modules/@ngneers/controls-mcp/skills
```

The CLI detects your agent and installs to `.claude/skills/`, `.cursor/rules/`,
`.agents/skills/`, etc. Pick specific skills with `--skill <name>` or take all
with `--all`.

### Built-in installer (`init`)

The package also has its own installer that needs no external CLI — it copies the
bundled skills into your project and interactively (via `awesome-logging`) asks
before overwriting an existing skill, comparing versions:

```bash
npx @ngneers/controls-mcp init              # → ./.claude/skills, prompts on conflicts
npx @ngneers/controls-mcp init --dir .cursor/rules
npx @ngneers/controls-mcp init --skill ngn-migrate --yes
npx @ngneers/controls-mcp init --list       # list bundled skills and exit
```

An up-to-date skill (same version) is left untouched; an older one prompts to
update (auto-yes with `--yes` or when there is no TTY).

> Note: the `skills` CLI's sources are git repos, git URLs, and local paths — an
> npm spec like `@ngneers/controls-mcp` is not itself a source, so install from
> the repo subpath or the package's `skills/` folder on disk (shown above). The
> skills are published with the package, so the local-path form works after a
> plain `npm install`. The **MCP prompts** (`author_theme`, `migrate_library`,
> `build_feature`) provide the same procedures in-protocol for any MCP client
> without a separate install.

## Development (in this monorepo)

```bash
# 1. Make sure the docs API data is fresh (produces typedoc.json)
pnpm --filter @ngneers/controls api-docs:generate

# 2. Rebuild the bundled knowledge pack from typedoc + docs markdown
pnpm --filter @ngneers/controls-mcp build:pack

# 3. Compile the server
pnpm --filter @ngneers/controls-mcp build:server

# Run against source without building (stdio):
pnpm --filter @ngneers/controls-mcp start

# Explore interactively with the MCP Inspector:
pnpm --filter @ngneers/controls-mcp inspect
```

## Layout

```
authored/               Hand-authored knowledge (merged into the pack)
  theme-schema.json       Theme token schema + authoring overview
  migrations/*.json       Per-source-library component maps
  recipes/*.md            Composition recipes (frontmatter + walkthrough)
skills/                 Agent skills (SKILL.md per task) for the skills CLI
scripts/build-pack.ts   Monorepo-only pack generator (typedoc + md + authored → JSON)
data/knowledge-pack.json Generated, committed, shipped artifact
src/pack.ts             Pack schema + runtime loader
src/render.ts           Markdown rendering + search helpers
src/resources.ts        ngn://control, ngn://concept, ngn://recipe resources
src/tools.ts            list_controls, get_control, search_docs
src/prompts.ts          explain_control, explain_concept
src/theming.ts          get_theme_schema, get_control_theme, scaffold_theme_part, get_theme_options, author_theme
src/migration.ts        list_migration_sources, map_component, search_migration, migrate_library
src/feature.ts          recommend_controls, build_feature
src/server.ts           Wires the pack into an McpServer
src/init.ts             `init` command — installs bundled skills (awesome-logging prompts)
src/index.ts            Entry point (bin): stdio server, or `init` subcommand
```
