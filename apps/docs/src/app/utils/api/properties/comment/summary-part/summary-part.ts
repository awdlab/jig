import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Platform } from '@ngneers/controls/api/ng';
import { CommentDisplayPart } from 'typedoc/browser';

@Component({
  selector: 'ngn-docs-api-summary-part',
  templateUrl: 'summary-part.html',
  imports: [RouterLink],
})
export class NgnDocsApiSummaryPart {
  public readonly part = input.required<CommentDisplayPart>();
  public readonly propKind = input.required<string>();

  protected readonly location = inject(Platform).isBrowser ? window.location.pathname : '';
}
