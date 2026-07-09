import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { registerFeature } from './feature.js';
import { registerMigration } from './migration.js';
import { loadPack } from './pack.js';
import { registerPrompts } from './prompts.js';
import { registerResources } from './resources.js';
import { registerTheming } from './theming.js';
import { registerTools } from './tools.js';

/**
 * Build the MCP server: load the bundled knowledge pack, then register the
 * three primitive layers against it. Kept free of transport concerns so it can
 * be reused from tests or a future HTTP entry point.
 */
export function createServer(): McpServer {
  const pack = loadPack();

  const server = new McpServer(
    { name: '@ngneers/controls-mcp', version: pack.controlsVersion },
    {
      instructions:
        'Knowledge server for @ngneers/controls, an Angular UI component library. Capabilities: ' +
        '(docs) list_controls / get_control / search_docs; ' +
        '(theming) get_theme_schema / get_control_theme / scaffold_theme_part; ' +
        '(migration) list_migration_sources / map_component / search_migration; ' +
        '(feature dev) recommend_controls. Prefer these over guessing component names, input ' +
        'signatures, theme tokens, or migration targets. The server is advisory — it returns ' +
        'knowledge and scaffolds; you make the file edits.',
    }
  );

  registerResources(server, pack);
  registerTools(server, pack);
  registerPrompts(server, pack);
  registerTheming(server, pack);
  registerMigration(server, pack);
  registerFeature(server, pack);

  return server;
}
