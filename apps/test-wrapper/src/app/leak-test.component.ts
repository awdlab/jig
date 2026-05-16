import {
  Component,
  ChangeDetectionStrategy,
  signal,
  type OnInit,
  type OnDestroy,
} from '@angular/core';
import tablerUser from '@iconify/icons-tabler/user';
import { NgnAccordion, NgnAccordionPanel } from '@ngneers/controls/accordion';
import { NgnTemplate } from '@ngneers/controls/api/ng';
import { NgnAvatar, NgnAvatarGroup } from '@ngneers/controls/avatar';
import { NgnBreadcrumb } from '@ngneers/controls/breadcrumb';
import { NgnButton } from '@ngneers/controls/button';
import { NgnButtonGroup } from '@ngneers/controls/button-group';
import { NgnCalendar } from '@ngneers/controls/calendar';
import { NgnCheckbox } from '@ngneers/controls/checkbox';
import { NgnChip } from '@ngneers/controls/chip';
import { NgnDefer } from '@ngneers/controls/defer';
import { NgnDialog } from '@ngneers/controls/dialog';
import { NgnEditInplace } from '@ngneers/controls/edit-inplace';
import { NgnFilter } from '@ngneers/controls/filter';
import { NgnIcon } from '@ngneers/controls/icon';
import { NgnInplace } from '@ngneers/controls/inplace';
import { NgnInput } from '@ngneers/controls/input';
import { NgnInputField } from '@ngneers/controls/input-field';
import { NgnInputMask } from '@ngneers/controls/input-mask';
import { NgnItemView } from '@ngneers/controls/item-view';
import { NgnListBox } from '@ngneers/controls/list-box';
import { NgnMessage } from '@ngneers/controls/message';
import { NgnPopover } from '@ngneers/controls/popover';
import { NgnProgress } from '@ngneers/controls/progress';
import { NgnScroller, NgnScrollerItem } from '@ngneers/controls/scroller';
import { NgnSelect } from '@ngneers/controls/select';
import { NgnSlider } from '@ngneers/controls/slider';
import { NgnSpinner } from '@ngneers/controls/spinner';
import { NgnSplitter, NgnSplitterPanel } from '@ngneers/controls/splitter';
import { NgnTableModule } from '@ngneers/controls/table';
import { NgnTab, NgnTabs } from '@ngneers/controls/tabs';
import { NgnTag } from '@ngneers/controls/tag';
import { NgnTooltip } from '@ngneers/controls/tooltip';

import type { NgnItem } from '@ngneers/controls/api';

declare global {
  interface Window {
    __leak_test_component?: unknown;
  }
}

@Component({
  selector: 'ngn-leak-test',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgnTemplate,
    NgnAccordion,
    NgnAccordionPanel,
    NgnAvatar,
    NgnAvatarGroup,
    NgnBreadcrumb,
    NgnButton,
    NgnButtonGroup,
    NgnCalendar,
    NgnCheckbox,
    NgnChip,
    NgnDefer,
    NgnDialog,
    NgnEditInplace,
    NgnFilter,
    NgnIcon,
    NgnInplace,
    NgnInput,
    NgnInputField,
    NgnInputMask,
    NgnItemView,
    NgnListBox,
    NgnMessage,
    NgnPopover,
    NgnProgress,
    NgnScroller,
    NgnScrollerItem,
    NgnSelect,
    NgnSlider,
    NgnSpinner,
    NgnSplitter,
    NgnSplitterPanel,
    NgnTab,
    NgnTabs,
    NgnTableModule,
    NgnTag,
    NgnTooltip,
  ],
  template: `
    @if (show()) {
      <!-- Accordion with panels -->
      <ngn-accordion>
        <ngn-accordion-panel panelId="panel1" header="Panel 1">
          <ng-template #content>Content 1</ng-template>
        </ngn-accordion-panel>
      </ngn-accordion>

      <!-- Avatar & AvatarGroup -->
      <ngn-avatar initials="AB" />
      <ngn-avatar-group>
        <ngn-avatar initials="A1" />
        <ngn-avatar initials="A2" />
      </ngn-avatar-group>

      <!-- Breadcrumb -->
      <ngn-breadcrumb [items]="breadcrumbItems()" />

      <!-- Button & ButtonGroup -->
      <button ngnButton kind="primary">Click me</button>
      <ngn-button-group>
        <button ngnButton kind="primary">Button 1</button>
        <button ngnButton kind="primary">Button 2</button>
      </ngn-button-group>

      <!-- Calendar -->
      <ngn-calendar
        [inline]="true"
        [value]="calendarValue()"
        (valueChange)="calendarValue.set($event)"
      />

      <!-- Checkbox -->
      <div>
        <ngn-checkbox
          [value]="checkboxValue()"
          [allowIndeterminate]="true"
          (valueChange)="checkboxValue.set($event)"
        />
        <span>Check me</span>
      </div>

      <!-- Chip -->
      <ngn-chip [closable]="true">Chip</ngn-chip>

      <!-- Defer -->
      <ngn-defer [open]="true" [lazyContent]="deferContent" />
      <ng-template #deferContent>Deferred content</ng-template>

      <!-- Dialog -->
      <button ngnButton kind="primary" (click)="dialogOpen.set(true)">
        Open dialog
      </button>
      <ngn-dialog
        title="Example dialog"
        [open]="dialogOpen()"
        (openChange)="dialogOpen.set($event)"
      >
        <ng-template #content>Dialog content</ng-template>
      </ngn-dialog>

      <!-- EditInplace -->
      <ngn-edit-inplace
        [value]="editInplaceValue()"
        (valueChange)="editInplaceValue.set($event)"
      />

      <!-- Filter -->
      <ngn-filter [data]="filterData()" dataType="string" />

      <!-- Icon -->
      <ngn-icon [icon]="userIcon" />

      <!-- Inplace -->
      <ngn-inplace>
        <ng-template #display>Display</ng-template>
        <ng-template #content let-content>
          <button ngnButton kind="primary" (click)="content.close()">
            Close
          </button>
        </ng-template>
      </ngn-inplace>

      <!-- Input -->
      <input ngnInput />

      <!-- InputField -->
      <ngn-input-field label="Label">
        <input ngnInput />
      </ngn-input-field>

      <!-- InputMask -->
      <ngn-input-mask [mask]="'time'">
        <input ngnInput />
      </ngn-input-mask>

      <!-- ItemView -->
      <ngn-item-view [items]="items()" [idField]="'testId'">
        <ng-template #item let-item>{{ item.label }}</ng-template>
      </ngn-item-view>

      <!-- ListBox -->
      <ngn-list-box [items]="items()" style="display: block;" />

      <!-- Message -->
      <ngn-message kind="outlined" [icon]="userIcon">Test message</ngn-message>

      <!-- Popover -->
      <button #popoverAnchor ngnButton>Toggle</button>
      <ngn-popover #popover [anchor]="popoverAnchor"
        >Popover content</ngn-popover
      >
      <button ngnButton kind="primary" (click)="popover.show()">
        Open popover
      </button>

      <!-- Progress -->
      <ngn-progress [value]="50" />

      <!-- Scroller -->
      <ngn-scroller [items]="items()" style="height: 100px;">
        <ng-template #item let-item>
          <div [ngnScrollerItem]="item" style="height: 30px;">
            {{ item.label }}
          </div>
        </ng-template>
      </ngn-scroller>

      <!-- Select -->
      <ngn-select [options]="items()" />

      <!-- Slider -->
      <ngn-slider />

      <!-- Spinner -->
      <ngn-spinner [size]="48" [thickness]="'4px'" [centered]="true" />

      <!-- Splitter -->
      <ngn-splitter
        [layout]="splitterLayout()"
        (layoutChange)="splitterLayout.set($event)"
        style="height: 200px; display: block;"
      >
        <ngn-splitter-panel>Panel 1</ngn-splitter-panel>
        <ngn-splitter-panel>Panel 2</ngn-splitter-panel>
      </ngn-splitter>

      <!-- Tabs -->
      <ngn-tabs>
        <ngn-tab tabId="tab1">
          <ng-template #header>Tab 1</ng-template>
          <ng-template #content>Tab Content 1</ng-template>
        </ngn-tab>
        <ngn-tab tabId="tab2">
          <ng-template #header>Tab 2</ng-template>
          <ng-template #content>Tab Content 2</ng-template>
        </ngn-tab>
      </ngn-tabs>

      <!-- Table -->
      <ngn-table
        #table
        [rows]="tableRows()"
        [fieldId]="'id'"
        style="height: 200px"
      >
        <ng-template #header>
          <tr ngnTableHeadTr>
            <th [ngnTableTh]="table.column('id')">ID</th>
            <th [ngnTableTh]="table.column('name')">Name</th>
          </tr>
        </ng-template>
        <ng-template #body let-row [ngnTemplate]="table.templateTypes.body">
          <tr [ngnTableBodyTr]="row">
            <td ngnTableTd>{{ row.data.id }}</td>
            <td ngnTableTd>{{ row.data.name }}</td>
          </tr>
        </ng-template>
      </ngn-table>

      <!-- Tag -->
      <ngn-tag kind="pill" [icon]="userIcon">Tag</ngn-tag>

      <!-- Tooltip -->
      <div [ngnTooltip]="'Tooltip text'">Hover me</div>
    }
  `,
})
export class LeakTestComponent implements OnInit, OnDestroy {
  protected readonly userIcon = tablerUser;
  public readonly show = signal(false);
  public readonly dialogOpen = signal(false);
  public readonly checkboxValue = signal<boolean | null>(false);
  public readonly calendarValue = signal<Date | null>(new Date());
  public readonly editInplaceValue = signal('Edit me');
  public readonly filterData = signal(['Alpha', 'Beta', 'Gamma']);
  public readonly splitterLayout = signal<'horizontal' | 'vertical'>(
    'horizontal',
  );

  public readonly tableRows = signal<readonly { id: number; name: string }[]>([
    { id: 1, name: 'Row 1' },
    { id: 2, name: 'Row 2' },
  ]);

  public readonly breadcrumbItems = signal([
    { id: 'home', label: 'Home' },
    { id: 'products', label: 'Products' },
  ]);

  public readonly items = signal<readonly NgnItem<unknown, number>[]>([
    { label: 'Item 1', value: 1, testId: 'item-1' },
    { label: 'Item 2', value: 2, testId: 'item-2' },
    { label: 'Item 3', value: 3, testId: 'item-3' },
  ]);

  public ngOnInit() {
    // Expose component instance to window for test access
    window.__leak_test_component = this;
  }

  public ngOnDestroy() {
    // Clean up window reference
    delete window.__leak_test_component;
  }

  public toggle() {
    this.show.set(!this.show());
  }

  public setShow(value: boolean) {
    this.show.set(value);
  }
}
