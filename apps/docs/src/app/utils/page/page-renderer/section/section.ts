import { Component, input, output } from '@angular/core';

import { Md } from '../../../md/md';

import type { TocEntry } from '../../../md/types';
import type { AwdDocsMdSection } from '../../types';

@Component({
  selector: 'jig-docs-section',
  templateUrl: 'section.html',
  imports: [Md],
  // Flows in the normal document; the page (body) is the scroll container. No
  // own scroll region — an `overflow-y:auto` here would become the scroll-spy's
  // scroll target and freeze the "on this page" indicator (it never scrolls).
  host: { class: 'w-full block py-8 pr-2 md:pr-8' },
})
export class AwdDocsPageSection {
  public readonly section = input.required<AwdDocsMdSection>();

  /** Forwards the content headings emitted by the underlying markdown render. */
  public readonly headings = output<TocEntry[]>();
}
