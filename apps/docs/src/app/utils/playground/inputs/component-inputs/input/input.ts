import {
  Component,
  input,
  computed,
  effect,
  inject,
  linkedSignal,
  type InputSignal,
  type Signal,
} from '@angular/core';
import { JigCalendar } from '@awdlab/jig/calendar';
import { JigFor } from '@awdlab/jig/directives';
import { JigInput } from '@awdlab/jig/input';
import { JigNumberInput } from '@awdlab/jig/number-input';
import { JigInputField } from '@awdlab/jig/input-field';
import { JigSelect } from '@awdlab/jig/select';
import { JigSpinButtons } from '@awdlab/jig/spin-buttons';
import { JigSwitch } from '@awdlab/jig/switch';
import { generateElementId, setInputSignalValue } from '@awdlab/jig/utils-ng';

import { JigDocsPlaygroundJsonInput } from './json-input/json-input';
import { JigDocsPlayground, type PlaygroundControl } from '../../../playground';

import type { AnyJigBase } from '@awdlab/jig/base';
import type { TypeDeclaration } from '../../../type-model';
import type { DeclarationReflection } from 'typedoc/browser';

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
    JigFor,
    JigDocsPlaygroundJsonInput,
  ],
  host: {
    // A switch is short enough to sit on the label's line.
    '[class.block]': '!isSwitch()',
    '[class.flex]': 'isSwitch()',
    '[class.items-center]': 'isSwitch()',
    '[class.justify-between]': 'isSwitch()',
    '[class.gap-2]': 'isSwitch()',
  },
})
export class JigDocsPlaygroundInput {
  private readonly _playground =
    inject<JigDocsPlayground<readonly PlaygroundControl[]>>(JigDocsPlayground);

  public readonly componentName = input.required<string>();
  public readonly input = input.required<DeclarationReflection>();
  public readonly instance = input<AnyJigBase>();
  /** The input's type, already resolved and filled in by the parent panel. */
  public readonly type = input.required<TypeDeclaration>();

  protected readonly controlId = generateElementId();
  protected readonly isSwitch = computed(() => {
    const type = this.type();
    return type.kind === 'primitive' && type.type === 'boolean';
  });

  protected readonly value = linkedSignal<any>(() => this.defaultValue());
  protected _previousInputValue: any = undefined;
  private _previousInstance: AnyJigBase | undefined;

  constructor() {
    effect(() => this._playground.setValue(this.componentName(), this.input().name, this.value()));

    effect(() => {
      const instance = this.instance();
      if (!instance) {
        return;
      }
      const value = this.value();
      const inputName = this.input().name;

      // A swapped-in instance starts from its defaults, so it gets every value re-applied.
      const swapped = this._previousInstance !== undefined && instance !== this._previousInstance;
      this._previousInstance = instance;

      if (swapped || (this._previousInputValue ?? undefined) !== (value ?? undefined)) {
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
}
