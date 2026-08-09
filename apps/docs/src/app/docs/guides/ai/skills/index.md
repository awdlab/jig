Alongside the [MCP Server](/guides/mcp), the `@awdlab/jig-mcp` package
ships agent **skills** — procedural guides that tell an agent _how_ to use the
MCP tools for a given task. They compose with the server: **skills carry the
procedure, MCP carries the data.**

Each skill is a `SKILL.md` with `name` + `description` frontmatter, the
convention used by the [`skills`](https://github.com/vercel-labs/skills) CLI and
compatible installers.

### The bundled skills

| Skill               | What it teaches the agent to do                                                                |
| ------------------- | ---------------------------------------------------------------------------------------------- |
| `awd-controls`      | Discover controls, look up the real API via `get_control`, honor signal conventions.           |
| `awd-migrate`       | Inventory `p-*` / `mat-*` / `ejs-*` usage, map each to its awd target, rewrite, and flag gaps. |
| `awd-theme`         | Author a product theme with tokens only — schema → anatomy → `scaffold_theme_part`.            |
| `awd-build-feature` | Compose controls into a feature: `recommend_controls` → recipe → `get_control` → scaffold.     |

### Installing the skills

They install two ways.

**Via the `skills` CLI** (resolves git repos, subpaths, and local paths):

```bash
# From the repo:
npx skills@latest add https://github.com/awdlab/jig/tree/main/packages/mcp/skills

# ...or from a local checkout / the installed package folder:
npx skills@latest add ./node_modules/@awdlab/jig-mcp/skills
```

The CLI detects your agent and installs to `.claude/skills/`, `.cursor/rules/`,
`.agents/skills/`, etc. Pick specific skills with `--skill <name>` or take all
with `--all`.

**Via the package's built-in installer** (`init`) — needs no external CLI. It
copies the bundled skills into your project and asks before overwriting an
existing skill, comparing versions:

```bash
npx @awdlab/jig-mcp init              # → ./.claude/skills, prompts on conflicts
npx @awdlab/jig-mcp init --dir .cursor/rules
npx @awdlab/jig-mcp init --skill awd-migrate --yes
npx @awdlab/jig-mcp init --list       # list bundled skills and exit
```

An up-to-date skill (same version) is left untouched; an older one prompts to
update (auto-yes with `--yes`, or when there is no TTY).

> The `skills` CLI's sources are git repos, git URLs, and local paths — an npm
> spec like `@awdlab/jig-mcp` is not itself a source, so install from the
> repo subpath or the package's `skills/` folder on disk. The **MCP prompts**
> (`author_theme`, `migrate_library`, `build_feature`) provide the same
> procedures in-protocol for any MCP client without a separate install.
