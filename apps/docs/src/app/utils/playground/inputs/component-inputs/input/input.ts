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
import { JigNumberInput } from '@awdlab/jig/number-input';
import { JigInputField } from '@awdlab/jig/input-field';
import { JigSelect } from '@awdlab/jig/select';
import { JigSwitch } from '@awdlab/jig/switch';
import { setInputSignalValue } from '@awdlab/jig/utils-ng';

import { collectParamValues, comboKey, resolveParams } from '../../../params';

import type { AnyJigBase } from '@awdlab/jig/base';
import type { ControlTypes, TypeDeclaration } from '../../../type-model';
import type { DeclarationReflection } from 'typedoc/browser';
import { JigSpinButtons } from '@awdlab/jig/spin-buttons';

@Component({
  selector: 'jig-docs-playground-input',
  templateUrl: 'input.html',
  imports: [
    JigInputField,
    JigNumberInput,
    JigSpinButtons,
    JigInput,
    JigSwitch,
    JigSelect,
    JigCalendar,
  ],
  host: {
    '[style.display]': 'isKnownType() ? "block" : "none"',
  },
})
export class JigDocsPlaygroundInput {
  private readonly _injector = inject(Injector);
  public readonly input = input.required<DeclarationReflection>();
  public readonly instance = input<AnyJigBase>();
  public readonly internalControlName = input.required<string>();
  public readonly controlTypes = input<ControlTypes | null>(null);

  protected readonly dataType = computed<TypeDeclaration | undefined>(() => {
    const themeType = this.themeDrivenType();
    if (themeType) {
      return themeType;
    }

    const types = this.controlTypes();
    const instance = this.instance();
    if (!types || !instance) {
      return undefined;
    }

    const key = comboKey(types.params, name => (instance as any)[name]?.());
    const inputs = types.combos[key];
    const type = inputs?.[this.input().name];
    if (!type) {
      return undefined;
    }

    const siblingValues = Object.keys(inputs).map(name => (instance as any)[name]?.() as unknown);
    return resolveParams(type, collectParamValues(siblingValues)) ?? undefined;
  });
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
      case 'array':
      case 'tuple':
      case 'object':
      case 'union':
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

  private readonly themeDrivenType = computed<TypeDeclaration | undefined>(() => {
    const name = this.input().name;
    const control = this.internalControlName();
    if (name === 'kind') {
      return this.valuesToLiteralUnion(
        runInInjectionContext(this._injector, () => injectThemeControlKinds(control)())
      );
    }
    if (name === 'color') {
      return this.valuesToLiteralUnion(
        runInInjectionContext(this._injector, () => injectThemeColors(control)())
      );
    }
    if (name === 'labelKind') {
      return this.valuesToLiteralUnion(
        runInInjectionContext(this._injector, () => injectThemeControlKinds('inputFieldLabel')())
      );
    }
    return undefined;
  });

  private valuesToLiteralUnion(values: (string | null | undefined)[]): TypeDeclaration | undefined {
    if (!values.length || values.every(v => !v)) {
      return undefined;
    }
    return {
      kind: 'literalUnion',
      primitiveType: 'string',
      allowCustomValue: false,
      values: values.map(v =>
        v ? { label: v, value: v } : { label: '- none -', value: undefined }
      ),
    };
  }
}
