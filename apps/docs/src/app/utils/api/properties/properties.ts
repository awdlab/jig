import {
  Component,
  input,
  ChangeDetectionStrategy,
  computed,
  inject,
  Injector,
  runInInjectionContext,
} from '@angular/core';
import { injectThemeColors, injectThemeControlKinds } from '@ngneers/controls/api/ng';
import { CommentDisplayPart, DeclarationReflection, ReflectionFlag } from 'typedoc/browser';

import { NgnDocsApiComment } from './comment/comment';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-docs-api-properties',
  templateUrl: 'properties.html',
  imports: [NgnDocsApiComment],
  host: { class: 'block overflow-x-auto md' },
})
export class NgnDocsApiProperties {
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
      injectThemeControlKinds(internalName)
    );
    const colors = runInInjectionContext(this._injector, () => injectThemeColors(internalName));

    const kind = kinds.length ? `'${kinds.join("' | '")}' | 'undefined'` : null;
    const color = colors.length ? `'${colors.join("' | '")}' | 'undefined'` : null;

    return {
      kind,
      color,
    };
  });
}
