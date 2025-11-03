import { Component, input } from '@angular/core';

import { Md } from '../../../md/md';
import { NgnDocsSection } from '../../types';

@Component({
  selector: 'ngn-docs-section',
  templateUrl: 'section.html',
  imports: [Md],
})
export class NgnDocsPageSection {
  public readonly section = input.required<NgnDocsSection>();
}
