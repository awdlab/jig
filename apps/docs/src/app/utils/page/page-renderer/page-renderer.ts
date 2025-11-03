import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgnDocsSinglePage } from '../types';
import { NgnDocsPageSection } from './section/section';

@Component({
  selector: 'ngn-docs-page-renderer',
  templateUrl: 'page-renderer.html',
  imports: [NgnDocsPageSection],
})
export class NgnDocsPageRenderer {
  protected readonly page = inject(ActivatedRoute).snapshot.data['page'] as NgnDocsSinglePage;
}
