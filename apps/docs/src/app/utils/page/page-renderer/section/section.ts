import { Component, input, ChangeDetectionStrategy } from '@angular/core';

import { Md } from '../../../md/md';
import { NgnDocsMdSection } from '../../types';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-docs-section',
  templateUrl: 'section.html',
  imports: [Md],
  host: { class: 'w-full h-full block overflow-y-auto py-8 pr-2 md:pr-8' },
})
export class NgnDocsPageSection {
  public readonly section = input.required<NgnDocsMdSection>();
}
