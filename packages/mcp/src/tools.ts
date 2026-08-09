import { z } from 'zod';

import {
  type KnowledgePack,
  controlHaystack,
  controlListLine,
  controlMarkdown,
  controlNames,
} from './render.js';

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

function text(body: string) {
  return { content: [{ type: 'text' as const, text: body }] };
}

/** Register the v1 (docs/explain) tool surface. */
export function registerTools(server: McpServer, pack: KnowledgePack): void {
  server.registerTool(
    'list_controls',
    {
      title: 'List awd controls',
      description:
        'List every @awdlab/jig control and directive with its selector and a ' +
        'one-line summary. Call this first to discover what exists before asking for details.',
      inputSchema: {},
    },
    async () => {
      const lines = pack.controls.map(controlListLine).join('\n');
      return text(`# @awdlab/jig — ${pack.controls.length} controls\n\n${lines}`);
    }
  );

  server.registerTool(
    'get_control',
    {
      title: 'Get an awd control',
      description:
        'Full reference for one control: selector, all inputs/outputs with types, defaults ' +
        'and descriptions, plus prose usage docs. Use before writing code that uses the control.',
      inputSchema: {
        name: z
          .string()
          .describe('Internal control name, e.g. "select", "number-input", "tooltip".'),
      },
    },
    async ({ name }) => {
      const key = name
        .trim()
        .toLowerCase()
        .replace(/^awd-?/, '');
      const control =
        pack.controls.find(c => c.name === key) ??
        pack.controls.find(c => c.className.toLowerCase() === `awd${key}`) ??
        pack.controls.find(c => c.name.replace(/-/g, '') === key.replace(/-/g, ''));
      if (!control) {
        return text(`No control named "${name}". Available controls: ${controlNames(pack)}.`);
      }
      return text(controlMarkdown(control, pack));
    }
  );

  server.registerTool(
    'search_docs',
    {
      title: 'Search awd docs',
      description:
        'Keyword search across all controls and concept guides (theming, colors, passthrough, ' +
        'state, getting started, …). Returns ranked matches. Use when you know what you want to ' +
        'do but not which control or guide covers it.',
      inputSchema: {
        query: z.string().describe('Free-text query, e.g. "how do I theme dark mode".'),
        limit: z
          .number()
          .int()
          .min(1)
          .max(25)
          .optional()
          .describe('Max results to return. @default 8'),
      },
    },
    async ({ query, limit }) => {
      const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
      if (!terms.length) return text('Empty query.');
      const max = limit ?? 8;

      const score = (haystack: string) =>
        terms.reduce((n, t) => n + (haystack.includes(t) ? 1 : 0), 0);

      type Hit = { label: string; ref: string; score: number };
      const hits: Hit[] = [];

      for (const c of pack.controls) {
        const s = score(controlHaystack(c));
        if (s > 0) {
          hits.push({
            label: `${c.className} — ${c.summary}`,
            ref: `control "${c.name}" (get_control) · awd://control/${c.name}`,
            score: s,
          });
        }
      }
      for (const g of pack.concepts) {
        const s = score(`${g.title} ${g.body}`.toLowerCase());
        if (s > 0) {
          hits.push({
            label: `Guide: ${g.title}`,
            ref: `explain_concept "${g.slug}" · awd://concept/${g.slug}`,
            score: s,
          });
        }
      }

      if (!hits.length) return text(`No matches for "${query}".`);

      hits.sort((a, b) => b.score - a.score);
      const body = hits
        .slice(0, max)
        .map(h => `- **${h.label}**\n  ↳ ${h.ref}`)
        .join('\n');
      return text(`# Results for "${query}"\n\n${body}`);
    }
  );
}
