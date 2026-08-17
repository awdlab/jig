import { defineConfig } from 'awesome-publish';

/**
 * Root (shared) config. Each publishable package has its own
 * `awesome-publish.config.ts` that spreads this and sets how it packs
 * (`publishDir` for build-from-dist packages, `publishFiles` for the rest).
 *
 * `buildCommand` is read from THIS root config only and runs once — it must
 * produce every publishable package's build output before packing.
 */
export default defineConfig({
  // Fallback only — every package overrides this.
  publishFiles: ['dist'],
  stripScripts: true,
  // Build the 5 publishable packages (in dependency order) — not the docs app,
  // test-wrapper or isolated. Runs at the repo root before packing.
  buildCommand:
    'pnpm --filter @awdlab/jig --filter @awdlab/jig-themes --filter @awdlab/jig-custom-types --filter @awdlab/jig-playwright --filter @awdlab/jig-mcp build',
  access: 'public',
  // Provenance requires a PUBLIC source repo; awdlab/jig is private, so
  // npm rejects it with E422. Re-enable if the repo is ever made public.
  provenance: false,
  changesets: { enabled: true, enforceInPR: true },
  github: { releases: { enabled: true, mode: 'combined' } },
  // Gemini via its OpenAI-compatible endpoint. Key comes from
  // AWESOME_PUBLISH_AI_KEY. AI notes never block a release if the call fails.
  aiProvider: {
    provider: 'openai-compatible',
    model: 'gemini-flash-latest',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai/',
  },
  aiReleaseNotes: true,
});
