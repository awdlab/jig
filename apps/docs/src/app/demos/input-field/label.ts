import { Component, signal } from '@angular/core';
import { JigInput } from '@awdlab/jig/input';
import { JigInputField } from '@awdlab/jig/input-field';
import { JigSelectButton } from '@awdlab/jig/select-button';

import type { CustomKind } from '@awdlab/jig-custom-types';

@Component({
  imports: [JigInput, JigInputField, JigSelectButton],
  selector: 'jig-demo-input-field-label',
  host: {
    style: 'display: flex; flex-direction: column; gap: 1.5rem; padding-top: 1rem;',
  },
  template: `
    <jig-select-button
      [options]="controls"
      [value]="control()"
      (valueChange)="control.set($event)"
      class="self-start"
    />
    @for (kind of kinds; track kind.kind) {
      <jig-input-field [label]="kind.label" [labelKind]="kind.kind">
        @if (control() === 'textarea') {
          <textarea
            jigInput
            rows="3"
            [value]="value()"
            (valueChange)="value.set($event ?? '')"
          ></textarea>
        } @else {
          <input jigInput [value]="value()" (valueChange)="value.set($event ?? '')" />
        }
      </jig-input-field>
    }
  `,
})
export class Demo_InputField_Label {
  protected readonly controls = [
    { label: 'Input', value: 'input' },
    { label: 'Textarea', value: 'textarea' },
  ] as const;
  protected readonly control = signal<'input' | 'textarea'>('input');
  protected readonly value = signal<string>('');
  protected readonly kinds: readonly {
    kind: CustomKind<'inputFieldLabel'>;
    label: string;
  }[] = [
    { kind: 'over', label: 'Label over' },
    { kind: 'in', label: 'Label in' },
    { kind: 'on', label: 'Label on' },
    { kind: 'floatOver', label: 'FloatLabel over' },
    { kind: 'floatIn', label: 'FloatLabel in' },
    { kind: 'floatOn', label: 'FloatLabel on' },
  ];
}
