import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { NgnAccordion, NgnAccordionPanel } from '@ngneers/controls/accordion';

@Component({
  selector: 'ngn-root',
  imports: [NgnAccordion, NgnAccordionPanel],
  template: `
    <button (click)="visible.set(!visible())">Toggle Tabs</button>
    @if (visible()) {
      <ngn-accordion>
        <ngn-accordion-panel [header]="'Panel 1'">
          <ng-template #content> 123 </ng-template>
        </ngn-accordion-panel>
        <ngn-accordion-panel [header]="'Panel 2'">
          <ng-template #content> 456 </ng-template>
        </ngn-accordion-panel>
        <ngn-accordion-panel [header]="'Panel 3'">
          <ng-template #content> 789 </ng-template>
        </ngn-accordion-panel>
      </ngn-accordion>
    }
  `,
})
export class App {
  protected readonly visible = signal(true);
}
