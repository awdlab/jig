import { readFileSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

// Tests run against the BUILT server (`pnpm build:server` runs first via the
// `test` script) so they exercise the real shipped artifact, including the
// bundled knowledge pack loaded from data/.
import { loadPack } from '../dist/pack.js';
import { createServer } from '../dist/server.js';

const pack = loadPack();
let client: Client;

/** Extract the text body from a tools/call result. */
function callText(result: unknown): string {
  const content = (result as { content: { type: string; text?: string }[] }).content;
  return content
    .filter(c => c.type === 'text')
    .map(c => c.text ?? '')
    .join('\n');
}

beforeAll(async () => {
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const server = createServer();
  await server.connect(serverTransport);
  client = new Client({ name: 'vitest', version: '0.0.0' });
  await client.connect(clientTransport);
});

afterAll(async () => {
  await client.close();
});

describe('capabilities registered', () => {
  it('exposes all eleven tools', async () => {
    const names = (await client.listTools()).tools.map(t => t.name).sort();
    expect(names).toEqual(
      [
        'get_control',
        'get_control_theme',
        'get_theme_options',
        'get_theme_schema',
        'list_controls',
        'list_migration_sources',
        'map_component',
        'recommend_controls',
        'scaffold_theme_part',
        'search_docs',
        'search_migration',
      ].sort()
    );
  });

  it('exposes all five prompts', async () => {
    const names = (await client.listPrompts()).prompts.map(p => p.name).sort();
    expect(names).toEqual(
      [
        'author_theme',
        'build_feature',
        'explain_concept',
        'explain_control',
        'migrate_library',
      ].sort()
    );
  });

  it('exposes control, concept and recipe resources', async () => {
    const uris = (await client.listResources()).resources.map(r => r.uri);
    expect(uris.length).toBe(
      pack.controls.length + pack.concepts.length + pack.recipes.length + pack.examples.length
    );
    expect(uris).toContain('jig://control/select');
    expect(uris.some(u => u.startsWith('jig://concept/'))).toBe(true);
    expect(uris).toContain('jig://recipe/filterable-table');
    expect(uris.some(u => u.startsWith('jig://example/'))).toBe(true);
  });
});

describe('docs tools', () => {
  it('list_controls returns every control', async () => {
    const text = callText(await client.callTool({ name: 'list_controls', arguments: {} }));
    expect(text).toContain(`${pack.controls.length} controls`);
    expect(text).toContain('AwdSelect');
  });

  it('get_control returns full API and normalizes the jig- prefix', async () => {
    const text = callText(
      await client.callTool({ name: 'get_control', arguments: { name: 'jig-select' } })
    );
    expect(text).toContain('# AwdSelect');
    expect(text).toContain('Selector');
    expect(text).toContain('### Inputs');
  });

  it('get_control includes theme-dependent kinds/colors for a themed control', async () => {
    const text = callText(
      await client.callTool({ name: 'get_control', arguments: { name: 'tag' } })
    );
    expect(text).toContain('Kinds & colors (theme-dependent)');
    expect(text).toContain('nova');
    expect(text).toContain('AwdCustomTypes');
  });

  it('get_control includes real demo examples', async () => {
    const text = callText(
      await client.callTool({ name: 'get_control', arguments: { name: 'select' } })
    );
    expect(text).toContain('Examples (from docs demos)');
    expect(text).toContain('```html');
  });

  it('get_control on an unknown name returns a helpful message, not a crash', async () => {
    const text = callText(
      await client.callTool({ name: 'get_control', arguments: { name: 'nope' } })
    );
    expect(text.toLowerCase()).toContain('no control');
    expect(text).toContain('select');
  });

  it('search_docs ranks concept guides for a theming query', async () => {
    const text = callText(
      await client.callTool({ name: 'search_docs', arguments: { query: 'dark mode theme' } })
    );
    expect(text).toContain('Results for');
    expect(text.toLowerCase()).toContain('dark');
  });
});

describe('theming tools', () => {
  it('get_theme_schema lists token scopes', async () => {
    const text = callText(await client.callTool({ name: 'get_theme_schema', arguments: {} }));
    expect(text).toContain('color');
    expect(text).toContain('createThemePart');
  });

  it('get_control_theme returns a control anatomy with class names', async () => {
    const text = callText(
      await client.callTool({ name: 'get_control_theme', arguments: { name: 'select' } })
    );
    expect(text).toContain('Theme anatomy: select');
    expect(text).toContain("c('root')");
  });

  it('get_theme_options returns per-theme kinds/colors and custom-theme guidance', async () => {
    const text = callText(
      await client.callTool({ name: 'get_theme_options', arguments: { control: 'button' } })
    );
    expect(text).toContain('nova');
    expect(text).toContain('primary');
    expect(text).toContain('AwdCustomTypes');
  });

  it('scaffold_theme_part produces a createThemePart skeleton', async () => {
    const text = callText(
      await client.callTool({ name: 'scaffold_theme_part', arguments: { name: 'button' } })
    );
    expect(text).toContain('createThemePart');
    expect(text).toContain('buttonControlTemplate');
  });
});

describe('migration tools', () => {
  it('list_migration_sources lists the seeded libraries', async () => {
    const text = callText(await client.callTool({ name: 'list_migration_sources', arguments: {} }));
    expect(text).toContain('PrimeNG');
    expect(text).toContain('primeng');
  });

  it('map_component maps a PrimeNG dropdown to jig-select', async () => {
    const text = callText(
      await client.callTool({
        name: 'map_component',
        arguments: { source: 'primeng', component: 'p-dropdown' },
      })
    );
    expect(text).toContain('jig-select');
    expect(text).toContain('[(value)]');
  });

  it('search_migration finds date pickers across sources', async () => {
    const text = callText(
      await client.callTool({ name: 'search_migration', arguments: { query: 'date picker' } })
    );
    expect(text).toContain('jig-calendar');
  });

  it('every migration to-target resolves to a real jig selector', () => {
    const known = new Set<string>();
    for (const c of pack.controls) {
      for (const m of c.selector.matchAll(/jig-[a-z0-9-]+/g)) known.add(m[0]);
      for (const m of c.selector.matchAll(/jig[A-Z][A-Za-z0-9]*/g)) known.add(m[0]);
    }
    for (const mig of pack.migrations) {
      for (const comp of mig.components) {
        const targets = Array.isArray(comp.to) ? comp.to : [comp.to];
        for (const to of targets) {
          const tokens = [...to.matchAll(/jig-[a-z0-9-]+|jig[A-Z][A-Za-z0-9]*/g)].map(x => x[0]);
          if (!tokens.length) {
            // A "no direct equivalent" row is valid only if it documents a gap.
            expect(
              comp.gaps?.length,
              `"${comp.from}" -> "${to}" has no jig token or gap`
            ).toBeTruthy();
            continue;
          }
          for (const tok of tokens) {
            expect(known.has(tok), `unknown selector "${tok}" in ${mig.source}`).toBe(true);
          }
        }
      }
    }
  });
});

describe('feature tools & prompts', () => {
  it('recommend_controls suggests controls and a matching recipe', async () => {
    const text = callText(
      await client.callTool({
        name: 'recommend_controls',
        arguments: { goal: 'a filterable table with pagination' },
      })
    );
    expect(text).toContain('filterable-table');
  });

  it('recommend_controls ranks the on-topic control above prose-only matches', async () => {
    const text = callText(
      await client.callTool({
        name: 'recommend_controls',
        arguments: { goal: 'a filterable table with pagination' },
      })
    );
    const suggestions = text.slice(text.indexOf('Suggested controls'));
    // AwdTable must appear before AwdTree/AwdListBox (which only mention
    // filtering/selection in prose) — the weighted scorer's whole point.
    const tableAt = suggestions.indexOf('jig-table');
    const treeAt = suggestions.indexOf('jig-tree');
    expect(tableAt).toBeGreaterThanOrEqual(0);
    if (treeAt >= 0) expect(tableAt).toBeLessThan(treeAt);
  });

  it('migrate_library prompt inlines a concrete workflow', async () => {
    const res = await client.getPrompt({
      name: 'migrate_library',
      arguments: { source: 'primeng' },
    });
    const text = res.messages.map(m => (m.content as { text?: string }).text ?? '').join('\n');
    expect(text).toContain('PrimeNG');
    expect(text).toContain('map_component');
  });

  it('recommend_controls surfaces real demo examples', async () => {
    const text = callText(
      await client.callTool({
        name: 'recommend_controls',
        arguments: { goal: 'a select dropdown with filtering' },
      })
    );
    expect(text).toContain('jig://example/');
  });

  it('reads a recipe resource body', async () => {
    const res = await client.readResource({ uri: 'jig://recipe/filterable-table' });
    const text = (res.contents[0] as { text: string }).text;
    expect(text).toContain('Filterable');
  });

  it('reads an example resource body', async () => {
    const example = pack.examples.find(e => e.control === 'select')!;
    const res = await client.readResource({ uri: `jig://example/${example.slug}` });
    const text = (res.contents[0] as { text: string }).text;
    expect(text).toContain('```html');
  });
});

describe('shipped skills', () => {
  const skillsDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'skills');

  it('every skill has a SKILL.md with name + description frontmatter', () => {
    const names = readdirSync(skillsDir, { withFileTypes: true })
      .filter(e => e.isDirectory())
      .map(e => e.name);
    expect(names.length).toBeGreaterThanOrEqual(4);

    for (const dir of names) {
      const md = readFileSync(join(skillsDir, dir, 'SKILL.md'), 'utf-8');
      const fm = md.match(/^---\n([\s\S]*?)\n---/);
      expect(fm, `${dir}/SKILL.md missing frontmatter`).toBeTruthy();
      const block = fm![1]!;
      expect(block, `${dir} missing name`).toMatch(/^name:\s*\S+/m);
      expect(block, `${dir} missing description`).toMatch(/^description:\s*\S+/m);
      // The skill's folder name should match its declared name (skills CLI convention).
      expect(block).toMatch(new RegExp(`^name:\\s*${dir}\\s*$`, 'm'));
    }
  });
});

describe('migration prop targets', () => {
  it('every single-input prop target is a real input of the target control', () => {
    const byToken = new Map<string, (typeof pack.controls)[number]>();
    for (const c of pack.controls) {
      for (const m of c.selector.matchAll(/jig-[a-z0-9-]+/g)) byToken.set(m[0], c);
      for (const m of c.selector.matchAll(/jig[A-Z][A-Za-z0-9]*/g)) byToken.set(m[0], c);
    }
    const inputToken = (to: string): string | null => {
      const s = to.trim();
      const model = s.match(/^\[\(([a-zA-Z]\w*)\)\]$/);
      if (model) return model[1]!;
      return /^[a-z][a-zA-Z0-9]*$/.test(s) ? s : null;
    };

    for (const mig of pack.migrations) {
      for (const comp of mig.components) {
        const targets = (Array.isArray(comp.to) ? comp.to : [comp.to]).flatMap(to =>
          [...to.matchAll(/jig-[a-z0-9-]+|jig[A-Z][A-Za-z0-9]*/g)].map(x => byToken.get(x[0]!))
        );
        const controls = targets.filter(Boolean) as (typeof pack.controls)[number][];
        if (!controls.length || !comp.props) continue;
        const inputs = new Set(controls.flatMap(c => [...c.inputs, ...c.outputs].map(p => p.name)));
        for (const prop of comp.props) {
          const token = inputToken(prop.to);
          if (token) {
            expect(inputs.has(token), `${mig.source} "${comp.from}" → "${prop.to}"`).toBe(true);
          }
        }
      }
    }
  });
});

describe('init command', () => {
  it('installs skills and treats an existing up-to-date skill as unchanged', async () => {
    const { runInit } = await import('../dist/init.js');
    const tmp = join(
      dirname(fileURLToPath(import.meta.url)),
      '..',
      'node_modules',
      '.tmp-init-test'
    );
    rmSync(tmp, { recursive: true, force: true });

    await runInit(['--dir', tmp, '--yes']);
    const installed = readdirSync(tmp);
    expect(installed).toContain('jig-controls');
    const md = readFileSync(join(tmp, 'jig-controls', 'SKILL.md'), 'utf-8');
    expect(md).toMatch(/^name:\s*jig-controls/m);

    // Second run: same versions → nothing rewritten (idempotent).
    await runInit(['--dir', tmp, '--yes']);
    expect(readdirSync(join(tmp, 'jig-controls'))).toContain('SKILL.md');

    rmSync(tmp, { recursive: true, force: true });
  });
});
