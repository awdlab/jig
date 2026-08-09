import {
  Component,
  input,
  computed,
  effect,
  linkedSignal,
  type InputSignal,
  inject,
  Injector,
  runInInjectionContext,
  type Signal,
} from '@angular/core';
import { injectThemeColors, injectThemeControlKinds } from '@awdlab/jig/api/ng';
import { JigCalendar } from '@awdlab/jig/calendar';
import { JigInput } from '@awdlab/jig/input';
import { JigInputField } from '@awdlab/jig/input-field';
import { JigSelect } from '@awdlab/jig/select';
import { JigSwitch } from '@awdlab/jig/switch';
import { notNullish } from '@awdlab/jig/utils';
import { setInputSignalValue } from '@awdlab/jig/utils-ng';

import type { JigItem } from '@awdlab/jig/api';
import type { AnyJigBase } from '@awdlab/jig/base';
import type { SomeType, DeclarationReflection } from 'typedoc/browser';

type TypeDeclaration = (
  | {
      kind: 'literal';
      value: string | number | bigint | boolean | null;
    }
  | {
      kind: 'primitive';
      type: string;
    }
  | {
      kind: 'array';
      elementType: TypeDeclaration;
    }
  | {
      kind: 'literalUnion';
      primitiveType: string;
      allowCustomValue: boolean;
      values: JigItem[];
    }
) & {
  optional?: boolean;
};

@Component({
  selector: 'jig-docs-playground-input',
  templateUrl: 'input.html',
  imports: [JigInputField, JigInput, JigSwitch, JigSelect, JigCalendar],
  host: {
    '[style.display]': 'isKnownType() ? "block" : "none"',
  },
})
export class JigDocsPlaygroundInput {
  private readonly _injector = inject(Injector);
  public readonly input = input.required<DeclarationReflection>();
  public readonly instance = input<AnyJigBase>();
  public readonly internalControlName = input.required<string>();

  protected readonly dataType = computed(() => this.buildTypeModel(this.input().type));
  protected readonly value = linkedSignal<any>(() => this.defaultValue());
  protected _previousInputValue: any = undefined;

  constructor() {
    effect(() => {
      const instance = this.instance();
      if (!instance) {
        return;
      }
      const value = this.value();
      const inputName = this.input().name;

      if ((this._previousInputValue ?? undefined) !== (value ?? undefined)) {
        this._previousInputValue = value;
        if (inputName in instance) {
          const input = (instance as any)[inputName] as InputSignal<unknown>;
          setInputSignalValue(input, value);
        }
      }
    });

    effect(() => {
      const instance = this.instance();
      if (!instance) {
        return;
      }
      const inputName = this.input().name;
      if (inputName in instance) {
        const output = (instance as any)[inputName] as Signal<unknown>;
        if (typeof output === 'function') {
          const val = output();
          if ((val ?? undefined) === (this._previousInputValue ?? undefined)) {
            return;
          }
          this._previousInputValue = val;
          this.value.set(val);
        }
      }
    });
  }

  protected readonly isKnownType = computed(() => this.isKnownTypeFn(this.dataType()));

  private isKnownTypeFn(type?: TypeDeclaration): boolean {
    if (!type) {
      return false;
    }
    switch (type.kind) {
      case 'primitive':
        return ['string', 'number', 'boolean', 'date'].includes(type.type);
      case 'literal':
        return true;
      case 'literalUnion':
        return type.values.length > 0;
      default:
        return false;
    }
  }

  private readonly defaultValue = computed(() => {
    const defaultComment = this.input().comment?.getTag('@default');
    if (!defaultComment) {
      return undefined;
    }

    const content = defaultComment.content;
    if (!content.length) {
      return undefined;
    }
    const value = content[0]?.kind === 'code' ? content[0]?.text : undefined;
    if (!value) {
      return undefined;
    }

    const numberRegex = /```ts\n(\d+)\n```/;
    const stringRegex = /```ts\n'(\w+)'\n```/;
    const booleanRegex = /```ts\n(true|false)\n```/;

    const numberMatch = value.match(numberRegex);
    if (numberMatch) {
      return Number(numberMatch[1]);
    }
    const stringMatch = value.match(stringRegex);
    if (stringMatch) {
      return stringMatch[1];
    }
    const booleanMatch = value.match(booleanRegex);
    if (booleanMatch) {
      return booleanMatch[1] === 'true';
    }

    return undefined;
  });

  private buildTypeModel(type?: SomeType): TypeDeclaration | undefined {
    if (!type) {
      return undefined;
    }

    function valuesToLiteralUnion(
      value: (string | null | undefined)[]
    ): TypeDeclaration | undefined {
      if (!value.length || value.every(v => !v)) {
        return undefined;
      }
      return {
        kind: 'literalUnion',
        primitiveType: 'string',
        allowCustomValue: false,
        values: value.map(c => {
          if (!c) {
            return { label: '- none -', value: undefined };
          }
          return {
            label: c,
            value: c,
          };
        }),
      };
    }

    if (this.input().name === 'kind') {
      const kinds = runInInjectionContext(this._injector, () =>
        injectThemeControlKinds(this.internalControlName())()
      );
      return valuesToLiteralUnion(kinds);
    } else if (this.input().name === 'color') {
      const colors = runInInjectionContext(this._injector, () =>
        injectThemeColors(this.internalControlName())()
      );
      return valuesToLiteralUnion(colors);
    } else if (this.input().name === 'labelKind') {
      const colors = runInInjectionContext(this._injector, () =>
        injectThemeControlKinds('inputFieldLabel')()
      );
      return valuesToLiteralUnion(colors);
    }

    switch (type.type) {
      case 'union': {
        const isOptional = type.types.some(
          t =>
            (t.type === 'intrinsic' && t.name === 'undefined') ||
            (t.type === 'literal' && t.value === null)
        );
        const filteredTypes = type.types.filter(
          t =>
            !(
              (t.type === 'intrinsic' && t.name === 'undefined') ||
              (t.type === 'literal' && t.value === null)
            )
        );
        if (filteredTypes.length === 1) {
          const res = this.buildTypeModel(filteredTypes[0]);
          if (!res) {
            return undefined;
          }
          if (isOptional) {
            res.optional = true;
          }
          return res;
        }

        const types = filteredTypes.map(t => this.buildTypeModel(t)).filter(notNullish);
        if (types.some(t => t.kind === 'literal')) {
          const literalTypes = types.filter(t => t.kind === 'literal');
          return {
            kind: 'literalUnion',
            optional: isOptional,
            primitiveType: typeof literalTypes[0]?.value,
            values: literalTypes.map(
              x =>
                <JigItem>{
                  label: x.value,
                  value: x.value,
                }
            ),
            allowCustomValue: types.some(t => t.kind !== 'literal'),
          };
        }
        return;
      }
      case 'intrinsic':
        return {
          kind: 'primitive',
          type: type.name,
        };

      case 'literal':
        return {
          kind: 'literal',
          value: type.value,
        };
      case 'reference':
        switch (type.name) {
          case 'Date':
            return {
              kind: 'primitive',
              type: 'date',
            };
        }
        return undefined;
    }
    return undefined;
  }
}
