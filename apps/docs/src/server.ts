import { join } from 'node:path';

import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

interface StatsData {
  version: string | null;
  stars: number | null;
}

// Request-driven cache for the stats endpoint (no timer).
let statsCache: { data: StatsData; timestamp: number } | null = null;
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes
const UPSTREAM_TIMEOUT_MS = 5000;

async function fetchNpmVersion(): Promise<string | null> {
  // Note: %2F encodes the scope slash in `@ngneers/controls`.
  const res = await fetch('https://registry.npmjs.org/@ngneers%2Fcontrols', {
    signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
  });
  if (!res.ok) {
    throw new Error(`npm registry responded ${res.status}`);
  }
  const json = (await res.json()) as { 'dist-tags'?: { latest?: string } };
  return json['dist-tags']?.latest ?? null;
}

async function fetchGithubStars(): Promise<number | null> {
  // TODO: repo is private, so this 404s (stars stay null) until it goes public.
  // User-Agent is required by the GitHub API (403 without it).
  const res = await fetch('https://api.github.com/repos/NGneers/controls', {
    headers: {
      'User-Agent': 'ngneers-controls-docs',
      Accept: 'application/vnd.github+json',
    },
    signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
  });
  if (!res.ok) {
    throw new Error(`GitHub API responded ${res.status}`);
  }
  const json = (await res.json()) as { stargazers_count?: number };
  return json.stargazers_count ?? null;
}

app.get('/api/stats', async (_req, res) => {
  if (statsCache && Date.now() - statsCache.timestamp < CACHE_TTL) {
    res.json(statsCache.data);
    return;
  }

  try {
    const [versionResult, starsResult] = await Promise.all([
      fetchNpmVersion().catch(() => null),
      fetchGithubStars().catch(() => null),
    ]);

    // Keep last known good values when one upstream fails rather than blanking it.
    const data: StatsData = {
      version: versionResult ?? statsCache?.data.version ?? null,
      stars: starsResult ?? statsCache?.data.stars ?? null,
    };
    statsCache = { data, timestamp: Date.now() };
    res.json(data);
  } catch {
    if (statsCache) {
      res.json(statsCache.data);
      return;
    }
    res.json({ version: null, stars: null } satisfies StatsData);
  }
});

// Serve static files from /browser.
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  })
);

// Render the Angular app for all other requests.
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then(response => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

// Start the server when run directly (port from PORT env, default 4000).
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, error => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Request handler used by the Angular CLI (dev-server / build) and serverless hosts.
export const reqHandler = createNodeRequestHandler(app);
