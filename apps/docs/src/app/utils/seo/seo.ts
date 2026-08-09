import { DOCUMENT, inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { PAGE_DESCRIPTIONS } from '../../docs/_generated/seo';

/** Canonical origin. Every absolute URL in head metadata is built from it. */
export const SITE_URL = 'https://jig.awdlab.dev';

const SITE_NAME = 'awd-controls';
const DEFAULT_DESCRIPTION =
  'A signal-based component library for Angular 22+ — 50+ accessible, themeable, ' +
  'tree-shakeable controls. Zoneless, standalone, no ControlValueAccessor.';
const SOCIAL_IMAGE = `${SITE_URL}/img/logo.png`;

export type SeoInput = {
  /** Page title, without the site suffix. */
  title: string;
  /** Overrides the generated per-route description. */
  description?: string;
  /** Keep the page out of search results (404, transient views). */
  noindex?: boolean;
};

/**
 * Owns everything in `<head>` that changes per route: title, description,
 * canonical link, and the Open Graph / Twitter cards.
 *
 * Descriptions come from `_generated/seo.ts`, which `tools/seo-gen.ts` derives
 * from each page's opening paragraph — so a page never ships with the generic
 * site description unless it genuinely has no prose.
 */
@Injectable({ providedIn: 'root' })
export class Seo {
  private readonly _title = inject(Title);
  private readonly _meta = inject(Meta);
  private readonly _router = inject(Router);
  private readonly _document = inject(DOCUMENT);

  public set(input: SeoInput): void {
    const path = this._router.url.split(/[?#]/)[0] ?? '/';
    const route = path.replace(/^\/+|\/+$/g, '');
    const canonical = route ? `${SITE_URL}/${route}` : `${SITE_URL}/`;
    const title = input.title ? `${input.title} - ${SITE_NAME}` : SITE_NAME;
    const description =
      input.description ?? PAGE_DESCRIPTIONS[route] ?? this._fallbackDescription(route);

    this._title.setTitle(title);
    this._meta.updateTag({ name: 'description', content: description });
    this._meta.updateTag({
      name: 'robots',
      content: input.noindex ? 'noindex, follow' : 'index, follow',
    });

    this._setCanonical(canonical);

    for (const [property, content] of [
      ['og:type', route ? 'article' : 'website'],
      ['og:site_name', SITE_NAME],
      ['og:title', title],
      ['og:description', description],
      ['og:url', canonical],
      ['og:image', SOCIAL_IMAGE],
    ] as const) {
      this._meta.updateTag({ property, content });
    }

    for (const [name, content] of [
      ['twitter:card', 'summary_large_image'],
      ['twitter:title', title],
      ['twitter:description', description],
      ['twitter:image', SOCIAL_IMAGE],
    ] as const) {
      this._meta.updateTag({ name, content });
    }
  }

  /**
   * A tabbed page's sub-routes (`/components/select/api`) have no description
   * of their own — fall back to the parent page's.
   */
  private _fallbackDescription(route: string): string {
    const parent = route.slice(0, route.lastIndexOf('/'));
    return PAGE_DESCRIPTIONS[parent] ?? DEFAULT_DESCRIPTION;
  }

  private _setCanonical(href: string): void {
    const head = this._document.head;
    let link = head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this._document.createElement('link');
      link.setAttribute('rel', 'canonical');
      head.appendChild(link);
    }
    link.setAttribute('href', href);
  }
}
