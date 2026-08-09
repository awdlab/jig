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

interface ReleaseData {
  tag: string;
  name: string;
  package: string | null;
  version: string | null;
  publishedAt: string | null;
  prerelease: boolean;
  url: string;
  body: string;
}

// Request-driven caches (no timers). Both upstreams are rate-limited, so a
// cache miss is the only thing that ever reaches them.
let statsCache: { data: StatsData; timestamp: number } | null = null;
let releasesCache: { data: ReleaseData[]; timestamp: number } | null = null;
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes
// A failure is cached too, just briefly: GitHub allows 60 unauthenticated
// requests per hour, and without this every visitor re-hits a failing upstream.
const FAILURE_TTL = 5 * 60 * 1000; // 5 minutes
const UPSTREAM_TIMEOUT_MS = 5000;
/** Releases pulled per refresh — enough for a changelog page without paging. */
const RELEASE_COUNT = 30;

async function fetchNpmVersion(): Promise<string | null> {
  // Note: %2F encodes the scope slash in `@awdlab/jig`.
  const res = await fetch('https://registry.npmjs.org/@awdlab%2Fcontrols', {
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
  const res = await fetch('https://api.github.com/repos/awdlab/jig', {
    headers: {
      'User-Agent': 'awdlab-controls-docs',
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

/**
 * GitHub releases, normalized for the changelog page. Releases are cut
 * per-package, so the tag carries both the package and its version
 * (`@awdlab/jig@0.0.1-next.6`).
 */
async function fetchReleases(): Promise<ReleaseData[]> {
  // TODO: repo is private, so this 404s (the changelog stays empty) until it
  // goes public. User-Agent is required by the GitHub API (403 without it).
  const res = await fetch(
    `https://api.github.com/repos/awdlab/jig/releases?per_page=${RELEASE_COUNT}`,
    {
      headers: {
        'User-Agent': 'awdlab-controls-docs',
        Accept: 'application/vnd.github+json',
      },
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    }
  );
  if (!res.ok) {
    throw new Error(`GitHub API responded ${res.status}`);
  }

  const json = (await res.json()) as {
    tag_name?: string;
    name?: string | null;
    published_at?: string | null;
    prerelease?: boolean;
    draft?: boolean;
    html_url?: string;
    body?: string | null;
  }[];

  return json
    .filter(release => !release.draft && !!release.tag_name)
    .map(release => {
      const tag = release.tag_name!;
      // Split on the LAST `@` so the scope's own `@` stays with the package.
      const at = tag.lastIndexOf('@');
      return {
        tag,
        name: release.name || tag,
        package: at > 0 ? tag.slice(0, at) : null,
        version: at > 0 ? tag.slice(at + 1) : null,
        publishedAt: release.published_at ?? null,
        prerelease: release.prerelease ?? false,
        url: release.html_url ?? `https://github.com/awdlab/jig/releases/tag/${tag}`,
        body: release.body ?? '',
      } satisfies ReleaseData;
    });
}

app.get('/api/changelog', async (_req, res) => {
  if (releasesCache && Date.now() - releasesCache.timestamp < CACHE_TTL) {
    res.json(releasesCache.data);
    return;
  }

  try {
    const data = await fetchReleases();
    releasesCache = { data, timestamp: Date.now() };
    res.json(data);
  } catch {
    // Serve the last known good list rather than an error page, and hold it for
    // FAILURE_TTL so a failing upstream is not retried on every request.
    releasesCache = {
      data: releasesCache?.data ?? [],
      timestamp: Date.now() - CACHE_TTL + FAILURE_TTL,
    };
    res.json(releasesCache.data);
  }
});

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
