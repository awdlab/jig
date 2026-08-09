import { Component } from '@angular/core';
import { NgnChip } from '@awdlab/jig/chip';

@Component({
  imports: [NgnChip],
  selector: 'awd-demo-chip-closable',
  template: `<awd-chip [closable]="true" (closed)="onChipClose()">Close me!</awd-chip>`,
})
export class Demo_Chip_Closable {
  protected onChipClose() {
    alert('Chip closed!');
  }
}
