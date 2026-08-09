#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { runInit } from './init.js';
import { createServer } from './server.js';

/**
 * Entry point with two modes:
 *   - (default, no args) MCP server over stdio — the client spawns this and
 *     pipes JSON-RPC. Nothing may go to stdout except protocol frames, so all
 *     logging goes to stderr.
 *   - `init` — a normal interactive CLI that installs the bundled skills into
 *     the current project (stdout is fine here).
 */
async function serve(): Promise<void> {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('[@awdlab/jig-mcp] ready (stdio)');
}

const command = process.argv[2];

if (command === 'init') {
  runInit(process.argv.slice(3))
    .then(() => process.exit(0))
    .catch(err => {
      console.error('[@awdlab/jig-mcp] init failed:', err);
      process.exit(1);
    });
} else if (command === '--help' || command === '-h') {
  console.log(
    'Usage:\n' +
      '  awdlab-controls-mcp            Start the MCP server (stdio).\n' +
      '  awdlab-controls-mcp init       Install the bundled agent skills into ./.claude/skills.\n' +
      '    --dir <path>                  Target directory (default .claude/skills).\n' +
      '    --skill <name>                Install only this skill (repeatable).\n' +
      '    --list                        List the bundled skills and exit.\n' +
      '    --yes, -y                     Overwrite outdated skills without prompting.'
  );
  process.exit(0);
} else {
  serve().catch(err => {
    console.error('[@awdlab/jig-mcp] fatal:', err);
    process.exit(1);
  });
}
