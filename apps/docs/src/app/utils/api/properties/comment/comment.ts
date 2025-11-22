import { AsyncPipe } from '@angular/common';
import { Component, computed, input, ChangeDetectionStrategy } from '@angular/core';
import { CommentDisplayPart } from 'typedoc/browser';

import { MarkdownPipe } from '../../../md/md-pipe';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-docs-api-comment',
  templateUrl: 'comment.html',
  imports: [MarkdownPipe, AsyncPipe],
})
export class NgnDocsApiComment {
  public readonly comment = input<CommentDisplayPart[] | undefined>();
  public readonly propKind = input.required<string>();

  protected readonly commentString = computed(() => {
    return (this.comment() ?? [])
      .map(part => {
        if (part.kind === 'text') {
          return part.text;
        } else if (part.kind === 'code') {
          if (part.text.startsWith('```')) {
            return `<span class="code-name-highlight">\n\n${part.text}\n\n</span>`;
          } else {
            return `<span class="code-name-highlight">${part.text}</span>`;
          }
        } else if (part.kind === 'inline-tag') {
          return `[${part.text}](#${`${this.propKind()}_${part.text}`})`;
        } else {
          console.warn('Unknown comment part kind:', part.kind);
          return '';
        }
      })
      .join('');
  });
}
