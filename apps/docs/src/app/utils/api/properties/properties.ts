import { Component, input, computed, inject, Injector, runInInjectionContext } from '@angular/core';
import { RouterLink } from '@angular/router';
import { injectThemeColors, injectThemeControlKinds } from '@awdlab/jig/api/ng';
import { type CommentDisplayPart, ReflectionFlag, DeclarationReflection } from 'typedoc/browser';

import { JigDocsApiComment } from './comment/comment';

import type { ApiGroupKind } from '../api';

/** One table: the members the control declares, or those it inherits. */
type MemberSection = {
  inherited: boolean;
  members: DeclarationReflection[];
};

@Component({
  selector: 'jig-docs-api-properties',
  templateUrl: 'properties.html',
  imports: [JigDocsApiComment, RouterLink],
  host: { class: 'block md' },
})
export class JigDocsApiProperties {
  public readonly kind = input.required<ApiGroupKind>();
  public readonly properties = input.required<DeclarationReflection[]>();
  public readonly internalControlName = input.required<string | null>();
  protected readonly FLAGS = ReflectionFlag;

  private readonly _injector = inject(Injector);

  protected getDefaultValue(prop: DeclarationReflection): CommentDisplayPart[] | undefined {
    return prop.comment?.getTag('@default')?.content;
  }

  /** `(a: string, b?: number) => void` for a method row. */
  protected signature(prop: DeclarationReflection): string {
    const signature = prop.signatures?.[0];
    if (!signature) {
      return '';
    }
    const params = (signature.parameters ?? [])
      .map(p => `${p.name}${p.flags.hasFlag(ReflectionFlag.Optional) ? '?' : ''}: ${p.type}`)
      .join(', ');
    return `(${params}) => ${signature.type}`;
  }

  /** Members of an interface, so a type's shape is readable without leaving the page. */
  protected members(type: DeclarationReflection): DeclarationReflection[] {
    return (type.children ?? []) as DeclarationReflection[];
  }

  /**
   * The control's own members first, then one section per base class they come
   * from. A flat alphabetical list buries `options` among `dirty` and `inputId`.
   */
  protected readonly sections = computed<MemberSection[]>(() => {
    if (this.kind() === 'Types') {
      return [{ inherited: false, members: this.properties() }];
    }
    const own: DeclarationReflection[] = [];
    const inherited: DeclarationReflection[] = [];
    for (const prop of this.properties()) {
      (prop.comment?.hasModifier('@inherited') ? inherited : own).push(prop);
    }
    return [
      ...(own.length ? [{ inherited: false, members: own }] : []),
      ...(inherited.length ? [{ inherited: true, members: inherited }] : []),
    ];
  });

  /**
   * `kind` and `color` are typed by the theme, not by the source. The row is
   * always shown — "this theme defines none" is API information too.
   */
  protected readonly specialTypes = computed<{ kind: string; color: string }>(() => {
    const internalName = this.internalControlName();
    if (!internalName) {
      return { kind: '', color: '' };
    }
    const union = (values: readonly string[]) =>
      values.length ? `'${values.join("' | '")}' | 'undefined'` : 'undefined';
    return {
      kind: union(
        runInInjectionContext(this._injector, () => injectThemeControlKinds(internalName)())
      ),
      color: union(runInInjectionContext(this._injector, () => injectThemeColors(internalName)())),
    };
  });
}
