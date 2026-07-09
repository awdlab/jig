import { controlMarkdown, exampleMarkdown, type KnowledgePack } from './render.js';

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

/**
 * Register read-only resources. Every control and concept is addressable so a
 * client can browse (`resources/list`) or pull one directly by URI without the
 * model having to call a tool. URIs:
 *   ngn://control/<name>
 *   ngn://concept/<slug>
 */
export function registerResources(server: McpServer, pack: KnowledgePack): void {
  for (const control of pack.controls) {
    server.registerResource(
      `control-${control.name}`,
      `ngn://control/${control.name}`,
      {
        title: `${control.className} (ngn-${control.name})`,
        description: control.summary,
        mimeType: 'text/markdown',
      },
      async uri => ({
        contents: [
          { uri: uri.href, mimeType: 'text/markdown', text: controlMarkdown(control, pack) },
        ],
      })
    );
  }

  for (const concept of pack.concepts) {
    server.registerResource(
      `concept-${concept.slug}`,
      `ngn://concept/${concept.slug}`,
      {
        title: concept.title,
        description: `Concept guide: ${concept.title}`,
        mimeType: 'text/markdown',
      },
      async uri => ({
        contents: [{ uri: uri.href, mimeType: 'text/markdown', text: concept.body }],
      })
    );
  }

  for (const recipe of pack.recipes) {
    server.registerResource(
      `recipe-${recipe.slug}`,
      `ngn://recipe/${recipe.slug}`,
      {
        title: recipe.title,
        description: recipe.summary,
        mimeType: 'text/markdown',
      },
      async uri => ({
        contents: [{ uri: uri.href, mimeType: 'text/markdown', text: recipe.body }],
      })
    );
  }

  for (const example of pack.examples) {
    server.registerResource(
      `example-${example.slug}`,
      `ngn://example/${example.slug}`,
      {
        title: `${example.control}: ${example.scenario}`,
        description: `Demo example — ${example.scenario} (${example.controls.join(', ')})`,
        mimeType: 'text/markdown',
      },
      async uri => ({
        contents: [{ uri: uri.href, mimeType: 'text/markdown', text: exampleMarkdown(example) }],
      })
    );
  }
}
