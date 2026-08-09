import { z } from 'zod';

import { type KnowledgePack, queryTerms, recipeListLine, scoreControl } from './render.js';

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

function text(body: string) {
  return { content: [{ type: 'text' as const, text: body }] };
}

/**
 * Feature development (capability 3). Recommends which controls to reach for a
 * goal and serves composition recipes. Leans on v1's get_control for exact APIs;
 * this layer is the task-oriented "what to compose" glue.
 */
export function registerFeature(server: McpServer, pack: KnowledgePack): void {
  server.registerTool(
    'recommend_controls',
    {
      title: 'Recommend controls for a goal',
      description:
        'Given a feature goal (e.g. "a filterable table with row selection"), suggest the jig ' +
        'controls to reach for and any matching composition recipes. Follow up with get_control.',
      inputSchema: {
        goal: z.string().describe('What you want to build, in plain language.'),
      },
    },
    async ({ goal }) => {
      const terms = queryTerms(goal);
      if (!terms.length) {
        return text(
          'Describe what you want to build, e.g. "a filterable table with row selection".'
        );
      }

      // Recipes are scored first: title/summary/control-list hits weigh more
      // than body hits, and the controls a matching recipe names then boost
      // those controls in the ranking below.
      const recipeHits = pack.recipes
        .map(r => {
          const strong = `${r.title} ${r.summary} ${r.controls.join(' ')}`.toLowerCase();
          const body = r.body.toLowerCase();
          const s = terms.reduce(
            (n, t) => n + (strong.includes(t) ? 3 : body.includes(t) ? 1 : 0),
            0
          );
          return { r, s };
        })
        .filter(x => x.s > 0)
        .sort((a, b) => b.s - a.s);

      const recipeControls = new Set(recipeHits.flatMap(x => x.r.controls));

      const topControls = pack.controls
        .map(c => ({ c, s: scoreControl(c, terms) + (recipeControls.has(c.name) ? 5 : 0) }))
        .filter(x => x.s > 0)
        .sort((a, b) => b.s - a.s)
        .slice(0, 8);

      const controls = topControls.map(
        x => `- **${x.c.className}** (\`${x.c.selector}\`) — ${x.c.summary}`
      );

      const recipes = recipeHits.map(x => recipeListLine(x.r));

      // Real demo examples whose primary control is among the top matches.
      const topNames = new Set(topControls.map(x => x.c.name));
      const examples = pack.examples
        .filter(e => topNames.has(e.control))
        .slice(0, 6)
        .map(e => `- ${e.scenario} (\`${e.control}\`) · jig://example/${e.slug}`);

      const parts = [`# Controls for: "${goal}"`];
      parts.push(
        controls.length
          ? `\n## Suggested controls\n\n${controls.join('\n')}`
          : '\n_No direct control matches — try list_controls._'
      );
      if (recipes.length)
        parts.push(
          `\n## Matching recipes\n\n${recipes.join('\n')}\n\nRead one via jig://recipe/<slug>.`
        );
      if (examples.length) parts.push(`\n## Real examples (docs demos)\n\n${examples.join('\n')}`);
      parts.push('\nNext: call get_control on each to get exact inputs before wiring.');
      return text(parts.join('\n'));
    }
  );

  server.registerPrompt(
    'build_feature',
    {
      title: 'Build a feature with jig controls',
      description: 'Guided workflow to build a new feature using @awdlab/jig.',
      argsSchema: { goal: z.string().describe('What you want to build.') },
    },
    ({ goal }) => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text:
              `Help me build this with @awdlab/jig: "${goal}".\n` +
              `1. Call recommend_controls("${goal}") to pick the controls + any recipe.\n` +
              `2. Read matching recipes (jig://recipe/<slug>) and get_control for each control ` +
              `to confirm real inputs/outputs.\n` +
              `3. Scaffold the feature using jig conventions (signal inputs, jig-input-field ` +
              `chrome, theme tokens — no hardcoded styles).\n` +
              `4. Wire state with signals/computed, then build and visually verify.`,
          },
        },
      ],
    })
  );
}
