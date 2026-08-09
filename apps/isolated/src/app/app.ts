import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { NgnAccordion, NgnAccordionPanel } from '@awdlab/jig/accordion';

@Component({
  selector: 'awd-root',
  imports: [NgnAccordion, NgnAccordionPanel],
  template: `
    <button (click)="visible.set(!visible())">Toggle Tabs</button>
    @if (visible()) {
      <awd-accordion>
        <awd-accordion-panel [header]="'Panel 1'">
          <ng-template #content> 123 </ng-template>
        </awd-accordion-panel>
        <awd-accordion-panel [header]="'Panel 2'">
          <ng-template #content> 456 </ng-template>
        </awd-accordion-panel>
        <awd-accordion-panel [header]="'Panel 3'">
          <ng-template #content> 789 </ng-template>
        </awd-accordion-panel>
      </awd-accordion>
    }
  `,
})
export class App {
  protected readonly visible = signal(true);
}
