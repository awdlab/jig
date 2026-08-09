import { Component, input, computed, inject, Injector, runInInjectionContext } from '@angular/core';
import { RouterLink } from '@angular/router';
import { injectThemeColors, injectThemeControlKinds } from '@awdlab/jig/api/ng';
import { type CommentDisplayPart, ReflectionFlag, DeclarationReflection } from 'typedoc/browser';

import { AwdDocsApiComment } from './comment/comment';

@Component({
  selector: 'jig-docs-api-properties',
  templateUrl: 'properties.html',
  imports: [AwdDocsApiComment, RouterLink],
  host: { class: 'block md' },
})
export class AwdDocsApiProperties {
  public readonly kind = input.required<'Inputs' | 'Outputs' | 'Properties'>();
  public readonly properties = input.required<DeclarationReflection[]>();
  public readonly internalControlName = input.required<string | null>();
  protected readonly FLAGS = ReflectionFlag;

  private readonly _injector = inject(Injector);

  protected getDefaultValue(prop: DeclarationReflection): CommentDisplayPart[] | undefined {
    const defaultTag = prop.comment?.getTag('@default');
    return defaultTag?.content;
  }

  protected readonly specialTypes = computed<{ kind: string | null; color: string | null }>(() => {
    const internalName = this.internalControlName();
    if (!internalName) {
      return {
        kind: '',
        color: '',
      };
    }
    const kinds = runInInjectionContext(this._injector, () =>
      injectThemeControlKinds(internalName)()
    );
    const colors = runInInjectionContext(this._injector, () => injectThemeColors(internalName)());

    const kind = kinds.length ? `'${kinds.join("' | '")}' | 'undefined'` : null;
    const color = colors.length ? `'${colors.join("' | '")}' | 'undefined'` : null;

    return {
      kind,
      color,
    };
  });
}
