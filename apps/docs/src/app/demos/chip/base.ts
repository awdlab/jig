import { Component } from '@angular/core';
import { injectThemeColors } from '@ngneers/controls/api/ng';
import { NgnChip } from '@ngneers/controls/chip';

@Component({
  selector: 'ngn-demo-chip-base',
  imports: [NgnChip],
  template: `
    <div class="flex gap-2 flex-wrap">
      @for (color of colors; track $index) {
        <ngn-chip [color]="color">
          {{ color ?? 'default' }}
        </ngn-chip>
      }
    </div>
  `,
})
export class Demo_Chip_Base {
  protected readonly colors = [null, ...injectThemeColors()];
}
