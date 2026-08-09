import { Component } from '@angular/core';
import { JigCheckbox } from '@awdlab/jig/checkbox';

/**
 * The same control rendered in each of the shared state flags. Every flag is a
 * `booleanAttribute` input on `ValueControlBase`; the theme toggles the matching
 * class on the host automatically.
 */
@Component({
  selector: 'jig-demo-control-state-flags',
  imports: [JigCheckbox],
  template: `
    <div class="flex flex-col gap-3">
      @for (state of states; track state.label) {
        <div class="flex items-center gap-2">
          <jig-checkbox
            #checkbox
            [value]="true"
            [disabled]="state.disabled"
            [readonly]="state.readonly"
            [invalid]="state.invalid"
            [invalidOn]="'immediate'"
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
