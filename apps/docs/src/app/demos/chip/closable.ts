import { Component } from '@angular/core';
import { JigChip } from '@awdlab/jig/chip';

@Component({
  imports: [JigChip],
  selector: 'jig-demo-chip-closable',
  template: `<jig-chip [closable]="true" (closed)="onChipClose()">Close me!</jig-chip>`,
})
export class Demo_Chip_Closable {
  protected onChipClose() {
    alert('Chip closed!');
  }
}
