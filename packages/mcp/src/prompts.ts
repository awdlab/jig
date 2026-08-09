import { completable } from '@modelcontextprotocol/sdk/server/completable.js';
import { z } from 'zod';

import { type KnowledgePack, controlMarkdown } from './render.js';

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

/**
 * Prompts are the cross-harness "workflow" mechanism: any MCP client can
 * surface these as slash-commands / quick actions. Each returns a ready-made
 * message with the relevant knowledge already inlined, so the model starts with
 * full context instead of having to fish for it.
 */
export function registerPrompts(server: McpServer, pack: KnowledgePack): void {
  const controlNames = pack.controls.map(c => c.name);
  const conceptSlugs = pack.concepts.map(c => c.slug);

  server.registerPrompt(
    'explain_control',
    {
      title: 'Explain a jig control',
      description: 'Explain how to use a specific @awdlab/jig control, with its full API.',
      argsSchema: {
        name: completable(z.string(), value =>
          controlNames.filter(n => n.startsWith(value.toLowerCase()))
        ),
      },
    },
    ({ name }) => {
      const key = name
        .trim()
        .toLowerCase()
        .replace(/^jig-?/, '');
      const control = pack.controls.find(c => c.name === key);
      const reference = control
        ? controlMarkdown(control, pack)
        : `(Unknown control "${name}". Known: ${controlNames.join(', ')}.)`;
      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text:
                `Explain how to use the ${name} control from @awdlab/jig. Cover its ` +
                `purpose, a minimal Angular template + component example, the most important ` +
                `inputs/outputs, and common pitfalls. Use idiomatic jig conventions (signal ` +
                `inputs, theme system). Reference:\n\n${reference}`,
            },
          },
        ],
      };
    }
  );

  server.registerPrompt(
    'explain_concept',
    {
      title: 'Explain a jig concept',
      description:
        'Explain an @awdlab/jig concept or guide (theming, colors, passthrough, state, …).',
      argsSchema: {
        topic: completable(z.string(), value =>
          conceptSlugs.filter(s => s.includes(value.toLowerCase()))
        ),
      },
    },
    ({ topic }) => {
      const key = topic.trim().toLowerCase();
      const concept =
        pack.concepts.find(c => c.slug === key) ??
        pack.concepts.find(c => c.slug.includes(key) || c.title.toLowerCase().includes(key));
      const reference = concept
        ? `# ${concept.title}\n\n${concept.body}`
        : `(No guide matched "${topic}". Known: ${conceptSlugs.join(', ')}.)`;
      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text:
                `Explain the "${topic}" concept in @awdlab/jig to a developer using the ` +
                `library. Be concrete and practical, with code where useful. ` +
                `Source guide:\n\n${reference}`,
            },
          },
        ],
      };
    }
  );
}
