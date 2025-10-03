import { Component } from '@angular/core';
import { NgnChip } from '@ngneers/controls/chip';

@Component({
  imports: [NgnChip],
  selector: 'ngn-chip-base',
  template: `
    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
      <ngn-chip>Neutral</ngn-chip>
      <ngn-chip kind="primary">Primary</ngn-chip>
      <ngn-chip kind="secondary">Secondary</ngn-chip>
      <ngn-chip kind="accent">Accent</ngn-chip>
      <ngn-chip kind="info">Info</ngn-chip>
      <ngn-chip kind="success">Success</ngn-chip>
      <ngn-chip kind="warning">Warning</ngn-chip>
      <ngn-chip kind="error">Error</ngn-chip>
    </div>
  `,
})
export class Demo_Chip_Base {}
