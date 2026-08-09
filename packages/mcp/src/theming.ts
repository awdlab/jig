import { completable } from '@modelcontextprotocol/sdk/server/completable.js';
import { z } from 'zod';

import {
  type KnowledgePack,
  scaffoldThemePart,
  themeOptionsMarkdown,
  themePartMarkdown,
  themeSchemaMarkdown,
} from './render.js';

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

function text(body: string) {
  return { content: [{ type: 'text' as const, text: body }] };
}

/**
 * Theme authoring (capability 2). Knowledge-only: returns the token schema, a
 * control's themeable anatomy, and ready-to-edit scaffolds. The agent writes
 * the actual product theme files.
 */
export function registerTheming(server: McpServer, pack: KnowledgePack): void {
  const partNames = pack.themeParts.map(p => p.name);
  const findPart = (name: string) => {
    const key = name
      .trim()
      .toLowerCase()
      .replace(/^jig-?/, '');
    return pack.themeParts.find(p => p.name === key || p.scope === key);
  };

  server.registerTool(
    'get_theme_schema',
    {
      title: 'Get the jig theme schema',
      description:
        'The theme token vocabulary (color/size/font/shadow/anim) plus the createThemePart ' +
        'authoring API (c/d/v helpers) and gotchas. Read this before authoring a product theme.',
      inputSchema: {},
    },
    async () => text(themeSchemaMarkdown(pack.themeSchema))
  );

  server.registerTool(
    'get_control_theme',
    {
      title: 'Get a control theme anatomy',
      description:
        "One control's themeable anatomy: its scope, the class names you target with c(), and " +
        'the dependency scopes you target with d(). Use before styling that control.',
      inputSchema: {
        name: z.string().describe('Control name, e.g. "select", "button", "dialog".'),
      },
    },
    async ({ name }) => {
      const part = findPart(name);
      if (!part) {
        return text(`No theme part for "${name}". Available: ${partNames.join(', ')}.`);
      }
      return text(themePartMarkdown(part));
    }
  );

  server.registerTool(
    'scaffold_theme_part',
    {
      title: 'Scaffold a theme part',
      description:
        'A ready-to-edit createThemePart skeleton for one control, with every class-name ' +
        'selector stubbed. The agent writes this into the product theme and fills the css.',
      inputSchema: {
        name: z.string().describe('Control name to scaffold a theme part for.'),
      },
    },
    async ({ name }) => {
      const part = findPart(name);
      if (!part) {
        return text(`No theme part for "${name}". Available: ${partNames.join(', ')}.`);
      }
      return text(scaffoldThemePart(part));
    }
  );

  server.registerTool(
    'get_theme_options',
    {
      title: 'Get theme kind & color options',
      description:
        'The allowed `kind` and `color` values for controls — these are theme-dependent, not ' +
        'static types. Returns values for the built-in themes (nova, shade); pass `theme` and/or ' +
        '`control` to narrow. For a CUSTOM theme, this explains where to read the values instead ' +
        "(the app's createTheme + JigCustomTypes). Use this to resolve a control's kind/color input.",
      inputSchema: {
        theme: z
          .string()
          .optional()
          .describe(`Built-in theme to scope to: ${pack.themes.map(t => t.name).join(', ')}.`),
        control: z.string().optional().describe('Control to scope to, e.g. "button", "tag".'),
      },
    },
    async ({ theme, control }) => text(themeOptionsMarkdown(pack, theme, control))
  );

  server.registerPrompt(
    'author_theme',
    {
      title: 'Author an jig product theme',
      description: 'Guided workflow to create or modify a product-specific jig theme.',
      argsSchema: {
        control: completable(z.string().optional(), value =>
          partNames.filter(n => n.startsWith((value ?? '').toLowerCase()))
        ),
      },
    },
    ({ control }) => {
      const target = control
        ? `Focus on theming the "${control}" control (call get_control_theme "${control}" and ` +
          `scaffold_theme_part "${control}").`
        : `Ask which controls to theme, then fetch each anatomy with get_control_theme.`;
      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text:
                `Help me author a product-specific theme for @awdlab/jig. ` +
                `First call get_theme_schema to load the token vocabulary and the c()/d()/v() ` +
                `authoring rules. ${target} Style exclusively through theme tokens (never ` +
                `hardcode colors), and account for dark-mode palette reversal. Produce theme ` +
                `part files I can drop into my product theme.`,
            },
          },
        ],
      };
    }
  );
}
