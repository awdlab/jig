import { Component, input } from '@angular/core';
import { Comment } from 'typedoc/browser';

import { NgnDocsApiSummaryPart } from './summary-part/summary-part';

@Component({
  selector: 'ngn-docs-api-comment',
  templateUrl: 'comment.html',
  imports: [NgnDocsApiSummaryPart],
})
export class NgnDocsApiComment {
  public readonly comment = input.required<Comment>();
  public readonly propKind = input.required<string>();
}
