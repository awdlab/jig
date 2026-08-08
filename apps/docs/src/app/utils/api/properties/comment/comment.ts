import { AsyncPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';

import { MarkdownPipe } from '../../../md/md-pipe';
import { RouteLinks } from '../../../route-links';

import type { CommentDisplayPart } from 'typedoc/browser';

@Component({
  selector: 'ngn-docs-api-comment',
  templateUrl: 'comment.html',
  styleUrl: 'comment.scss',
  imports: [MarkdownPipe, AsyncPipe],
  // `{@link}` targets render as plain `<a href>` inside `[innerHTML]`.
  hostDirectives: [RouteLinks],
})
export class NgnDocsApiComment {
  public readonly comment = input<CommentDisplayPart[] | undefined>();

  protected readonly commentString = computed(() => {
    return (this.comment() ?? [])
      .map(part => {
        if (part.kind === 'text') {
          return part.text;
        } else if (part.kind === 'code') {
          if (part.text.startsWith('```')) {
            // Fenced value (e.g. a TypeDoc `@default`): render as a compact
            // syntax-highlighted block (see comment.scss). No wrapping chip
            // span — that added the faint grey bars around the code block.
            return `\n\n${part.text}\n\n`;
          } else {
            return `<span class="code-name-highlight">${part.text}</span>`;
          }
        } else if (part.kind === 'inline-tag') {
          // `api-links-gen` rewrote resolvable targets to docs URLs; anything
          // still pointing at a reflection has no page to link to.
          return typeof part.target === 'string'
            ? `[${part.text}](${part.target})`
            : `<span class="code-name-highlight">${part.text}</span>`;
        } else {
          console.warn('Unknown comment part kind:', part.kind);
          return '';
        }
      })
      .join('');
  });
}
