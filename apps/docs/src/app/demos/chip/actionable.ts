import { Component, computed } from '@angular/core';
import { injectThemeControlKinds } from '@ngneers/controls/api/ng';
import { NgnChip } from '@ngneers/controls/chip';

@Component({
  selector: 'ngn-demo-chip-actionable',
  imports: [NgnChip],
  template: `
    <div class="flex flex-col flex-wrap gap-2">
      <div class="flex flex-wrap gap-2">
        <ngn-chip [actionable]="true" (clicked)="onChipClick()">Click me!</ngn-chip>
        <ngn-chip
          [actionable]="true"
          [closable]="true"
          (clicked)="onChipClick()"
          (closed)="onChipClose()"
        >
          Click or close me!
        </ngn-chip>
      </div>
      <div class="flex flex-wrap gap-2">
        @for (kind of kinds(); track $index) {
          <ngn-chip [kind]="kind" [actionable]="true" (clicked)="onChipClick()">
            {{ kind ?? '*no kind*' }}
          </ngn-chip>
        }
      </div>
    </div>
  `,
})
export class Demo_Chip_Actionable {
  private readonly _kinds = injectThemeControlKinds('chip');
  protected readonly kinds = computed(() => [null, ...this._kinds()]);

  protected onChipClick() {
    alert('Chip clicked!');
  }

  protected onChipClose() {
    alert('Chip closed!');
  }
}
