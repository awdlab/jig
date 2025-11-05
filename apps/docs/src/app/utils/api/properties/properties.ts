import { Component, input } from '@angular/core';
import { CommentDisplayPart, DeclarationReflection, ReflectionFlag } from 'typedoc/browser';

import { NgnDocsApiComment } from './comment/comment';

@Component({
  selector: 'ngn-docs-api-properties',
  templateUrl: 'properties.html',
  imports: [NgnDocsApiComment],
  host: { class: 'block overflow-x-auto md' },
})
export class NgnDocsApiProperties {
  public readonly kind = input.required<'Inputs' | 'Outputs' | 'Properties'>();
  public readonly properties = input.required<DeclarationReflection[]>();
  public readonly FLAGS = ReflectionFlag;

  public getDefaultValue(prop: DeclarationReflection): CommentDisplayPart[] | undefined {
    const defaultTag = prop.comment?.getTag('@default');
    return defaultTag?.content;
  }
}
