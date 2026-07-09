import { completable } from '@modelcontextprotocol/sdk/server/completable.js';
import { z } from 'zod';

import {
  type KnowledgePack,
  type Migration,
  migrationComponentMarkdown,
  migrationOverview,
} from './render.js';

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

function text(body: string) {
  return { content: [{ type: 'text' as const, text: body }] };
}

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

/**
 * Library migration (capability 1). Knowledge-only: serves hand-authored
 * component + prop/event maps from source libraries (PrimeNG, Angular Material,
 * Syncfusion) onto ngn controls. The agent does the rewrites, verifying targets
 * against get_control.
 */
export function registerMigration(server: McpServer, pack: KnowledgePack): void {
  const sources = pack.migrations.map(m => m.source);
  const bySource = new Map<string, Migration>(pack.migrations.map(m => [m.source, m]));

  const findComponent = (m: Migration, name: string) => {
    const n = normalize(name);
    return (
      m.components.find(c => normalize(c.from) === n) ??
      m.components.find(c => normalize(c.from).includes(n))
    );
  };

  server.registerTool(
    'list_migration_sources',
    {
      title: 'List migration sources',
      description:
        'List the source component libraries with a migration map to ngn controls, and how ' +
        'many components each covers. Call first when migrating from another library.',
      inputSchema: {},
    },
    async () => {
      const lines = pack.migrations
        .map(m => `- **${m.label}** (\`${m.source}\`) — ${m.components.length} components mapped`)
        .join('\n');
      return text(`# Migration sources\n\n${lines}`);
    }
  );

  server.registerTool(
    'map_component',
    {
      title: 'Map a component to ngn',
      description:
        'Map one source-library component onto its ngn equivalent, with prop/event mappings ' +
        'and gaps. Omit `component` to get the whole migration overview for a source.',
      inputSchema: {
        source: z.string().describe(`Source library slug: ${sources.join(', ')}.`),
        component: z
          .string()
          .optional()
          .describe('Source component, e.g. "p-dropdown", "mat-select". Omit for the overview.'),
      },
    },
    async ({ source, component }) => {
      const m = bySource.get(normalize(source)) ?? bySource.get(source.toLowerCase());
      if (!m) {
        return text(`Unknown source "${source}". Available: ${sources.join(', ')}.`);
      }
      if (!component) return text(migrationOverview(m));
      const comp = findComponent(m, component);
      if (!comp) {
        return text(
          `No mapping for "${component}" in ${m.label}. ` +
            `Try search_migration or map_component("${m.source}") for the full list.`
        );
      }
      return text(migrationComponentMarkdown(m.label, comp));
    }
  );

  server.registerTool(
    'search_migration',
    {
      title: 'Search migration maps',
      description:
        'Find the ngn equivalent for a source component or feature by keyword, across one ' +
        'source (if given) or all of them.',
      inputSchema: {
        query: z.string().describe('e.g. "dropdown", "date", "table pagination".'),
        source: z
          .string()
          .optional()
          .describe(`Restrict to one source: ${sources.join(', ')}.`),
      },
    },
    async ({ query, source }) => {
      const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
      const pool = source
        ? pack.migrations.filter(
            m => m.source === normalize(source) || m.source === source.toLowerCase()
          )
        : pack.migrations;

      type Hit = { line: string; score: number };
      const hits: Hit[] = [];
      for (const m of pool) {
        for (const c of m.components) {
          const hay =
            `${c.from} ${Array.isArray(c.to) ? c.to.join(' ') : c.to} ${c.notes ?? ''}`.toLowerCase();
          const score = terms.reduce((n, t) => n + (hay.includes(t) ? 1 : 0), 0);
          if (score > 0) {
            const to = Array.isArray(c.to) ? c.to.join(', ') : c.to;
            hits.push({
              line: `- \`${c.from}\` → \`${to}\` _(${m.label})_ · map_component("${m.source}", "${c.from}")`,
              score,
            });
          }
        }
      }
      if (!hits.length) return text(`No migration matches for "${query}".`);
      hits.sort((a, b) => b.score - a.score);
      return text(
        `# Migration matches for "${query}"\n\n${hits
          .slice(0, 15)
          .map(h => h.line)
          .join('\n')}`
      );
    }
  );

  server.registerPrompt(
    'migrate_library',
    {
      title: 'Migrate a library to ngn controls',
      description:
        'Guided workflow to migrate from PrimeNG / Angular Material / Syncfusion to ngn.',
      argsSchema: {
        source: completable(z.string(), value =>
          sources.filter(s => s.startsWith((value ?? '').toLowerCase()))
        ),
      },
    },
    ({ source }) => {
      const m = bySource.get(normalize(source)) ?? bySource.get(source.toLowerCase());
      const label = m?.label ?? source;
      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text:
                `Help me migrate this project from ${label} to @ngneers/controls. Workflow:\n` +
                `1. Inventory the ${label} components in use (grep the templates).\n` +
                `2. For each, call map_component("${m?.source ?? source}", "<component>") to get ` +
                `the ngn target + prop/event mapping. Use search_migration when unsure.\n` +
                `3. Before rewriting, confirm the ngn target's real inputs with get_control.\n` +
                `4. Rewrite templates + component code, honoring the [(ngModel)] → [(value)] and ` +
                `input-field wrapping conventions. Flag any gaps rather than fabricating features.\n` +
                `5. Build and visually verify each migrated screen.`,
            },
          },
        ],
      };
    }
  );
}
