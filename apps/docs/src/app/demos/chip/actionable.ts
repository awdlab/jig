import { Component, computed } from '@angular/core';
import { injectThemeControlKinds } from '@awdlab/jig/api/ng';
import { AwdChip } from '@awdlab/jig/chip';

@Component({
  selector: 'jig-demo-chip-actionable',
  imports: [AwdChip],
  template: `
    <div class="flex flex-col flex-wrap gap-2">
      <div class="flex flex-wrap gap-2">
        <jig-chip [actionable]="true" (clicked)="onChipClick()">Click me!</jig-chip>
        <jig-chip
          [actionable]="true"
          [closable]="true"
          (clicked)="onChipClick()"
          (closed)="onChipClose()"
        >
          Click or close me!
        </jig-chip>
      </div>
      <div class="flex flex-wrap gap-2">
        @for (kind of kinds(); track $index) {
          <jig-chip [kind]="kind" [actionable]="true" (clicked)="onChipClick()">
            {{ kind ?? '*no kind*' }}
          </jig-chip>
        }
      </div>
    </div>
  `,
})
export class Demo_Chip_Actionable {
  private readonly _kinds = injectThemeControlKinds('chip');
  protected readonly kinds = computed(() => [undefined, ...this._kinds()]);

  protected onChipClick() {
    alert('Chip clicked!');
  }

  protected onChipClose() {
    alert('Chip closed!');
  }
}
