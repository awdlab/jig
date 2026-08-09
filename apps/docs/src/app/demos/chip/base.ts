import { Component } from '@angular/core';
import { injectThemeColors } from '@awdlab/jig/api/ng';
import { NgnChip } from '@awdlab/jig/chip';

@Component({
  selector: 'awd-demo-chip-base',
  imports: [NgnChip],
  template: `
    <div class="flex flex-wrap gap-2">
      @for (color of colors(); track $index) {
        <awd-chip [color]="color">
          {{ color }}
        </awd-chip>
      }
    </div>
  `,
})
export class Demo_Chip_Base {
  protected readonly colors = injectThemeColors('chip');
}
