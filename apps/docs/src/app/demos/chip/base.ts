import { Component, ChangeDetectionStrategy } from '@angular/core';
import { injectThemeColors } from '@ngneers/controls/api/ng';
import { NgnChip } from '@ngneers/controls/chip';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-demo-chip-base',
  imports: [NgnChip],
  template: `
    <div class="flex flex-wrap gap-2">
      @for (color of colors; track $index) {
        <ngn-chip [color]="color">
          {{ color }}
        </ngn-chip>
      }
    </div>
  `,
})
export class Demo_Chip_Base {
  protected readonly colors = injectThemeColors('chip');
}
