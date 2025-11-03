import { Component, input } from '@angular/core';
import { DeclarationReflection, ReflectionFlag } from 'typedoc/browser';

import { NgnDocsApiComment } from './comment/comment';

@Component({
  selector: 'ngn-docs-api-properties',
  templateUrl: 'properties.html',
  imports: [NgnDocsApiComment],
  host: { class: 'block overflow-x-auto' },
})
export class NgnDocsApiProperties {
  public readonly kind = input.required<'Inputs' | 'Outputs' | 'Properties'>();
  public readonly properties = input.required<DeclarationReflection[]>();
  public readonly FLAGS = ReflectionFlag;
}
