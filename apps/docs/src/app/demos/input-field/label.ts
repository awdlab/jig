import { Component, signal } from '@angular/core';
import { JigInput } from '@awdlab/jig/input';
import { JigInputField } from '@awdlab/jig/input-field';

@Component({
  imports: [JigInput, JigInputField],
  selector: 'jig-demo-input-field-label',
  host: {
    style: 'display: flex; flex-direction: column; gap: 1.5rem; padding-top: 1rem;',
  },
  template: `
    <jig-input-field [label]="'Label over'" [labelKind]="'over'">
      <input jigInput [value]="value()" (valueChange)="value.set($event ?? '')" />
    </jig-input-field>
    <jig-input-field [label]="'Label in'" [labelKind]="'in'">
      <input jigInput [value]="value()" (valueChange)="value.set($event ?? '')" />
    </jig-input-field>
    <jig-input-field [label]="'Label on'" [labelKind]="'on'">
      <input jigInput [value]="value()" (valueChange)="value.set($event ?? '')" />
    </jig-input-field>
    <jig-input-field [label]="'FloatLabel over'" [labelKind]="'floatOver'">
      <input jigInput [value]="value()" (valueChange)="value.set($event ?? '')" />
    </jig-input-field>
    <jig-input-field [label]="'FloatLabel in'" [labelKind]="'floatIn'">
      <input jigInput [value]="value()" (valueChange)="value.set($event ?? '')" />
    </jig-input-field>
    <jig-input-field [label]="'FloatLabel on'" [labelKind]="'floatOn'">
      <input jigInput [value]="value()" (valueChange)="value.set($event ?? '')" />
    </jig-input-field>
  `,
})
export class Demo_InputField_Label {
  protected readonly value = signal<string>('');
}
