import { Component } from '@angular/core';
import { injectThemeColors } from '@awdlab/jig/api/ng';
import { JigChip } from '@awdlab/jig/chip';

@Component({
  selector: 'jig-demo-chip-base',
  imports: [JigChip],
  template: `
    <div class="flex flex-wrap gap-2">
      @for (color of colors(); track $index) {
        <jig-chip [color]="color">
          {{ color }}
        </jig-chip>
      }
    </div>
  `,
})
export class Demo_Chip_Base {
  protected readonly colors = injectThemeColors('chip');
}
