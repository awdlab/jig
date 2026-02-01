import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgnDocsSinglePage } from '../types';
import { NgnDocsPageSection } from './section/section';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-docs-page-renderer',
  templateUrl: 'page-renderer.html',
  imports: [NgnDocsPageSection],
  host: { class: 'w-full flex flex-col' },
})
export class NgnDocsPageRenderer {
  protected readonly page = inject(ActivatedRoute).snapshot.data['page'] as NgnDocsSinglePage;
}
