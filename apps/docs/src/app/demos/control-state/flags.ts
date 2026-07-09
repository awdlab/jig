import { Component } from '@angular/core';
import { NgnCheckbox } from '@ngneers/controls/checkbox';

/**
 * The same control rendered in each of the shared state flags. Every flag is a
 * `booleanAttribute` input on `ValueControlBase`; the theme toggles the matching
 * class on the host automatically.
 */
@Component({
  selector: 'ngn-demo-control-state-flags',
  imports: [NgnCheckbox],
  template: `
    <div class="flex flex-col gap-3">
      @for (state of states; track state.label) {
        <div class="flex items-center gap-2">
          <ngn-checkbox
            #checkbox
            [value]="true"
            [disabled]="state.disabled"
            [readonly]="state.readonly"
            [invalid]="state.invalid"
          />
          <label [for]="checkbox.inputId()">
            {{ state.label }}
          </label>
        </div>
      }
    </div>
  `,
})
export class Demo_ControlState_Flags {
  protected readonly states = [
    { label: 'Default', disabled: false, readonly: false, invalid: false },
    { label: 'Disabled', disabled: true, readonly: false, invalid: false },
    { label: 'Readonly', disabled: false, readonly: true, invalid: false },
    { label: 'Invalid', disabled: false, readonly: false, invalid: true },
  ];
}
