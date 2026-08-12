import { Component } from '@angular/core';
import { JigInputField } from '@awdlab/jig/input-field';
import { DATE_TIME_MASKS, JigMaskInput, type MaskInputCfg } from '@awdlab/jig/mask-input';

@Component({
  selector: 'jig-demo-mask-input-states',
  imports: [JigMaskInput, JigInputField],
  template: `
    Default:
    <jig-input-field>
      <jig-mask-input [mask]="mask" [value]="'12:30:00'" />
    </jig-input-field>
    Readonly:
    <jig-input-field>
      <jig-mask-input [mask]="mask" [value]="'12:30:00'" readonly />
    </jig-input-field>
    Disabled:
    <jig-input-field>
      <jig-mask-input [mask]="mask" [value]="'12:30:00'" disabled />
    </jig-input-field>
    Invalid:
    <jig-input-field>
      <jig-mask-input [mask]="mask" [value]="'12:30:00'" [invalidOn]="'immediate'" invalid />
    </jig-input-field>
    Invalid + Readonly:
    <jig-input-field>
      <jig-mask-input
        [mask]="mask"
        [value]="'12:30:00'"
        [invalidOn]="'immediate'"
        invalid
        readonly
      />
    </jig-input-field>
    Invalid + Disabled:
    <jig-input-field>
      <jig-mask-input
        [mask]="mask"
        [value]="'12:30:00'"
        [invalidOn]="'immediate'"
        invalid
        disabled
      />
    </jig-input-field>
  `,
  host: { class: 'w-48' },
})
export class Demo_MaskInput_States {
  protected readonly mask: MaskInputCfg = DATE_TIME_MASKS.time;
}
