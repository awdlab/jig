import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { NgnFilter } from '@ngneers/controls/filter';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-demo-filter-datatypes',
  imports: [NgnFilter],
  template: `
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <div class="text-sm font-medium">List</div>
        <ngn-filter
          mode="inline"
          dataType="list"
          [data]="listData"
          (filterResultChange)="listFiltered.set($event)"
        />
        <div class="text-sm opacity-70">
          Filtered: {{ listFilteredComputed().length }}/{{ listData.length }}
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <div class="text-sm font-medium">String</div>
        <ngn-filter
          mode="inline"
          [dataType]="'string'"
          [data]="stringData"
          (filterResultChange)="stringFiltered.set($event)"
        />
        <div class="text-sm opacity-70">
          Filtered: {{ stringFilteredComputed().length }}/{{ stringData.length }}
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <div class="text-sm font-medium">Number</div>
        <ngn-filter
          mode="inline"
          [dataType]="'number'"
          [data]="numberData"
          (filterResultChange)="numberFiltered.set($event)"
        />
        <div class="text-sm opacity-70">
          Filtered: {{ numberFilteredComputed().length }}/{{ numberData.length }}
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <div class="text-sm font-medium">Date</div>
        <ngn-filter
          mode="inline"
          [dataType]="'date'"
          [data]="dateData"
          (filterResultChange)="dateFiltered.set($event)"
        />
        <div class="text-sm opacity-70">
          Filtered: {{ dateFilteredComputed().length }}/{{ dateData.length }}
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <div class="text-sm font-medium">DateTime</div>
        <ngn-filter
          mode="inline"
          [dataType]="'dateTime'"
          [data]="dateTimeData"
          (filterResultChange)="dateTimeFiltered.set($event)"
        />
        <div class="text-sm opacity-70">
          Filtered: {{ dateTimeFilteredComputed().length }}/{{ dateTimeData.length }}
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <div class="text-sm font-medium">Boolean</div>
        <ngn-filter
          mode="inline"
          [dataType]="'boolean'"
          [data]="booleanData"
          (filterResultChange)="booleanFiltered.set($event)"
        />
        <div class="text-sm opacity-70">
          Filtered: {{ booleanFilteredComputed().length }}/{{ booleanData.length }}
        </div>
      </div>
    </div>
  `,
})
export class Demo_Filter_DataTypes {
  protected readonly listData: readonly string[] = [
    'Germany',
    'France',
    'Italy',
    'Spain',
    'Sweden',
  ];
  protected readonly stringData: readonly string[] = [
    'Germany',
    'France',
    'Italy',
    'Spain',
    'Sweden',
  ];
  protected readonly numberData: readonly number[] = [1, 2, 3, 10, 15, 20];
  protected readonly dateData: readonly Date[] = [
    new Date('2025-01-01'),
    new Date('2025-02-01'),
    new Date('2025-03-01'),
  ];
  protected readonly dateTimeData: readonly Date[] = [
    new Date('2025-01-01T08:00'),
    new Date('2025-01-01T12:30'),
    new Date('2025-01-02T09:15'),
  ];
  protected readonly booleanData: readonly boolean[] = [true, false, true, false];

  protected readonly listFiltered = signal<readonly string[] | null>(null);
  protected readonly stringFiltered = signal<readonly string[] | null>(null);
  protected readonly numberFiltered = signal<readonly number[] | null>(null);
  protected readonly dateFiltered = signal<readonly Date[] | null>(null);
  protected readonly dateTimeFiltered = signal<readonly Date[] | null>(null);
  protected readonly booleanFiltered = signal<readonly boolean[] | null>(null);

  protected readonly listFilteredComputed = computed(() => this.listFiltered() ?? this.listData);
  protected readonly stringFilteredComputed = computed(
    () => this.stringFiltered() ?? this.stringData
  );
  protected readonly numberFilteredComputed = computed(
    () => this.numberFiltered() ?? this.numberData
  );
  protected readonly dateFilteredComputed = computed(() => this.dateFiltered() ?? this.dateData);
  protected readonly dateTimeFilteredComputed = computed(
    () => this.dateTimeFiltered() ?? this.dateTimeData
  );
  protected readonly booleanFilteredComputed = computed(
    () => this.booleanFiltered() ?? this.booleanData
  );
}
