import { Component } from '@angular/core';
import { injectThemeControlKinds } from '@ngneers/controls/api/ng';
import { NgnChip } from '@ngneers/controls/chip';

@Component({
  imports: [NgnChip],
  selector: 'ngn-chip-actionable',
  template: `
    <div class="flex flex-col gap-2 flex-wrap">
      <div class="flex gap-2 flex-wrap">
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
      <div class="flex gap-2 flex-wrap">
        @for (kind of kinds; track $index) {
          <ngn-chip [kind]="kind" [actionable]="true" (clicked)="onChipClick()">
            {{ kind ?? '*no kind*' }}
          </ngn-chip>
        }
      </div>
    </div>
  `,
})
export class Demo_Chip_Actionable {
  protected readonly kinds = [null, ...injectThemeControlKinds('chip')];

  protected onChipClick() {
    alert('Chip clicked!');
  }

  protected onChipClose() {
    alert('Chip closed!');
  }
}
