import { Component, signal } from '@angular/core';
import { JigFilterField, type JigFilterConfig } from '@awdlab/jig/filter-field';
import { JigSlider } from '@awdlab/jig/slider';

const AGES = [19, 24, 31, 38, 44, 52, 61];

@Component({
  selector: 'jig-demo-filter-field-custom-template',
  imports: [JigFilterField, JigSlider],
  template: `
    <div class="flex flex-col gap-2" style="width: 320px; max-width: 100%">
      <jig-filter-field
        mode="inline"
        dataType="number"
        [data]="ages"
        (filterResultChange)="filtered.set($event)"
      >
        <ng-template #filter let-setValue="setValue">
          <div class="flex flex-col gap-2" style="padding: 0.5rem">
            <span class="text-sm">Minimum age: {{ min() }}</span>
            <jig-slider
              [min]="18"
              [max]="65"
              [value]="min()"
              (valueChange)="setMinimum($event, setValue)"
            />
          </div>
        </ng-template>
      </jig-filter-field>
      <div class="text-sm opacity-70">{{ filtered().join(', ') || 'nothing' }}</div>
    </div>
  `,
})
export class Demo_FilterField_CustomTemplate {
  protected readonly ages = AGES;
  protected readonly filtered = signal<readonly number[]>(AGES);
  protected readonly min = signal(18);

  /** The slider writes an ordinary configuration, so the field filters as usual. */
  protected setMinimum(value: number | null, setValue: (c: JigFilterConfig | null) => void): void {
    const min = value ?? 18;
    this.min.set(min);
    setValue({
      dataType: 'number',
      matchMode: 'all',
      conditions: [{ operator: 'greaterThanOrEqual', rawValue: String(min) }],
    });
  }
}
