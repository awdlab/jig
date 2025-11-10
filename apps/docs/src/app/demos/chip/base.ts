import { Component } from '@angular/core';
import { injectThemeControlKinds } from '@ngneers/controls/api/ng';
import { NgnChip } from '@ngneers/controls/chip';

@Component({
  selector: 'ngn-demo-chip-base',
  imports: [NgnChip],
  template: `
    <div class="flex gap-2 flex-wrap">
      @for (kind of kinds; track $index) {
        <ngn-chip [kind]="kind">{{ kind ?? '*no kind*' }}</ngn-chip>
      }
    </div>
  `,
})
export class Demo_Chip_Base {
  protected readonly kinds = [null, ...injectThemeControlKinds('chip')];
}
