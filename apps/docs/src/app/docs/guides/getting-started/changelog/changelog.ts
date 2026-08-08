import { HttpClient } from '@angular/common/http';
import { afterNextRender, Component, computed, inject, signal } from '@angular/core';
import { NgnHint } from '@ngneers/controls/hint';
import { NgnSpinner } from '@ngneers/controls/spinner';
import { NgnTag } from '@ngneers/controls/tag';

import { getMarked } from '../../../../utils/md/marked';
import { Seo } from '../../../../utils/seo';

/** One GitHub release, as `/api/changelog` normalizes it. */
type Release = {
  tag: string;
  name: string;
  package: string | null;
  version: string | null;
  publishedAt: string | null;
  prerelease: boolean;
  url: string;
  body: string;
};

type RenderedRelease = Release & { html: string };

@Component({
  selector: 'ngn-docs-changelog',
  templateUrl: 'changelog.html',
  styleUrl: 'changelog.scss',
  imports: [NgnHint, NgnSpinner, NgnTag],
  host: {
    class: 'min-w-0 w-full h-full flex flex-col pt-[5.5rem]',
  },
})
export class NgnDocsChangelog {
  private readonly _http = inject(HttpClient);

  protected readonly releases = signal<RenderedRelease[] | null>(null);
  protected readonly failed = signal(false);

  /** Releases grouped by package, newest first, so one package reads as a run. */
  protected readonly packages = computed(() => {
    const grouped = new Map<string, RenderedRelease[]>();
    for (const release of this.releases() ?? []) {
      const key = release.package ?? 'Releases';
      grouped.set(key, [...(grouped.get(key) ?? []), release]);
    }
    return [...grouped.entries()].map(([name, releases]) => ({ name, releases }));
  });

  constructor() {
    inject(Seo).set({
      title: 'Changelog',
      description:
        'Every released version of @ngneers/controls and its companion packages, with the ' +
        'notes from each GitHub release.',
    });

    // Browser-only: /api/changelog has no live server during prerender, and the
    // list is not content a crawler needs.
    afterNextRender(() => {
      this._http.get<Release[]>('/api/changelog').subscribe({
        next: releases => void this._render(releases),
        error: () => this.failed.set(true),
      });
    });
  }

  protected formatDate(iso: string | null): string {
    if (!iso) {
      return '';
    }
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  /**
   * Release notes are markdown. They are rendered through the same `marked`
   * instance the docs use, then bound with `[innerHTML]` so Angular's sanitizer
   * still strips anything active out of the upstream payload.
   */
  private async _render(releases: Release[]): Promise<void> {
    const marked = await getMarked();
    const rendered = await Promise.all(
      releases.map(async release => ({
        ...release,
        html: release.body ? await marked(release.body) : '',
      }))
    );
    this.releases.set(rendered);
  }
}
