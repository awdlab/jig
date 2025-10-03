import { Component } from '@angular/core';
import { NgnChip } from '@ngneers/controls/chip';

@Component({
  imports: [NgnChip],
  selector: 'ngn-chip-actionable',
  template: `
    <div style="display: flex; flex-direction: column; gap: 8px; flex-wrap: wrap;">
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <ngn-chip [actionable]="true" (clicked)="onChipClick()">Click me!</ngn-chip>
        <ngn-chip
          [actionable]="true"
          [closable]="true"
          (clicked)="onChipClick()"
          (closed)="onChipClose()"
          >Click or close me!</ngn-chip
        >
      </div>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <ngn-chip kind="primary" [actionable]="true" (clicked)="onChipClick()">Primary</ngn-chip>
        <ngn-chip kind="secondary" [actionable]="true" (clicked)="onChipClick()"
          >Secondary</ngn-chip
        >
        <ngn-chip kind="accent" [actionable]="true" (clicked)="onChipClick()">Accent</ngn-chip>
        <ngn-chip kind="info" [actionable]="true" (clicked)="onChipClick()">Info</ngn-chip>
        <ngn-chip kind="success" [actionable]="true" (clicked)="onChipClick()">Success</ngn-chip>
        <ngn-chip kind="warning" [actionable]="true" (clicked)="onChipClick()">Warning</ngn-chip>
        <ngn-chip kind="error" [actionable]="true" (clicked)="onChipClick()">Error</ngn-chip>
      </div>
    </div>
  `,
})
export class Demo_Chip_Actionable {
  protected onChipClick() {
    alert('Chip clicked!');
  }

  protected onChipClose() {
    alert('Chip closed!');
  }
}
