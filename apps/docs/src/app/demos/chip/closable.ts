import { Component } from '@angular/core';
import { NgnChip } from '@ngneers/controls/chip';

@Component({
  imports: [NgnChip],
  selector: 'ngn-chip-closable',
  template: `<ngn-chip [closable]="true" (closed)="onChipClose()">Close me!</ngn-chip>`,
})
export class Demo_Chip_Closable {
  protected onChipClose() {
    alert('Chip closed!');
  }
}
