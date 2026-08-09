import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { JigAccordion, JigAccordionPanel } from '@awdlab/jig/accordion';

@Component({
  selector: 'jig-root',
  imports: [JigAccordion, JigAccordionPanel],
  template: `
    <button (click)="visible.set(!visible())">Toggle Tabs</button>
    @if (visible()) {
      <jig-accordion>
        <jig-accordion-panel [header]="'Panel 1'">
          <ng-template #content> 123 </ng-template>
        </jig-accordion-panel>
        <jig-accordion-panel [header]="'Panel 2'">
          <ng-template #content> 456 </ng-template>
        </jig-accordion-panel>
        <jig-accordion-panel [header]="'Panel 3'">
          <ng-template #content> 789 </ng-template>
        </jig-accordion-panel>
      </jig-accordion>
    }
  `,
})
export class App {
  protected readonly visible = signal(true);
}
