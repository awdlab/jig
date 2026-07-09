import { Component, input, output } from '@angular/core';

import { Md } from '../../../md/md';

import type { TocEntry } from '../../../md/types';
import type { NgnDocsMdSection } from '../../types';

@Component({
  selector: 'ngn-docs-section',
  templateUrl: 'section.html',
  imports: [Md],
  host: { class: 'w-full h-full block overflow-y-auto py-8 pr-2 md:pr-8' },
})
export class NgnDocsPageSection {
  public readonly section = input.required<NgnDocsMdSection>();

  /** Forwards the content headings emitted by the underlying markdown render. */
  public readonly headings = output<TocEntry[]>();
}
