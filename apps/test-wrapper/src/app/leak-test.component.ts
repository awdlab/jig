import {
  Component,
  ChangeDetectionStrategy,
  signal,
  type OnInit,
  type OnDestroy,
} from '@angular/core';
import tablerUser from '@iconify/icons-tabler/user';
import { NgnAccordion, NgnAccordionPanel } from '@awdlab/jig/accordion';
import { NgnTemplate } from '@awdlab/jig/api/ng';
import { NgnAvatar, NgnAvatarGroup } from '@awdlab/jig/avatar';
import { NgnBreadcrumb } from '@awdlab/jig/breadcrumb';
import { NgnButton } from '@awdlab/jig/button';
import { NgnButtonGroup } from '@awdlab/jig/button-group';
import { NgnCalendar } from '@awdlab/jig/calendar';
import { NgnCheckbox } from '@awdlab/jig/checkbox';
import { NgnChip } from '@awdlab/jig/chip';
import { NgnDefer } from '@awdlab/jig/defer';
import { NgnDialog } from '@awdlab/jig/dialog';
import { NgnEditInplace } from '@awdlab/jig/edit-inplace';
import { NgnFilter } from '@awdlab/jig/filter';
import { NgnIcon } from '@awdlab/jig/icon';
import { NgnInplace } from '@awdlab/jig/inplace';
import { NgnInput } from '@awdlab/jig/input';
import { NgnInputField } from '@awdlab/jig/input-field';
import { NgnMaskInput } from '@awdlab/jig/mask-input';
import { NgnItemView } from '@awdlab/jig/item-view';
import { NgnListBox } from '@awdlab/jig/list-box';
import { NgnMessage } from '@awdlab/jig/message';
import { NgnPopover } from '@awdlab/jig/popover';
import { NgnProgress } from '@awdlab/jig/progress';
import { NgnScroller, NgnScrollerItem } from '@awdlab/jig/scroller';
import { NgnSelect } from '@awdlab/jig/select';
import { NgnSlider } from '@awdlab/jig/slider';
import { NgnSpinner } from '@awdlab/jig/spinner';
import { NgnSplitter, NgnSplitterPanel } from '@awdlab/jig/splitter';
import { NgnTableModule } from '@awdlab/jig/table';
import { NgnTab, NgnTabs } from '@awdlab/jig/tabs';
import { NgnTag } from '@awdlab/jig/tag';
import { NgnTooltip } from '@awdlab/jig/tooltip';

import type { NgnItem } from '@awdlab/jig/api';

declare global {
  interface Window {
    __leak_test_component?: unknown;
  }
}

@Component({
  selector: 'awd-leak-test',

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
    NgnMaskInput,
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
      <awd-accordion>
        <awd-accordion-panel panelId="panel1" header="Panel 1">
          <ng-template #content>Content 1</ng-template>
        </awd-accordion-panel>
      </awd-accordion>

      <!-- Avatar & AvatarGroup -->
      <awd-avatar initials="AB" />
      <awd-avatar-group>
        <awd-avatar initials="A1" />
        <awd-avatar initials="A2" />
      </awd-avatar-group>

      <!-- Breadcrumb -->
      <awd-breadcrumb [items]="breadcrumbItems()" />

      <!-- Button & ButtonGroup -->
      <button ngnButton kind="primary">Click me</button>
      <awd-button-group>
        <button ngnButton kind="primary">Button 1</button>
        <button ngnButton kind="primary">Button 2</button>
      </awd-button-group>

      <!-- Calendar -->
      <awd-calendar
        [inline]="true"
        [value]="calendarValue()"
        (valueChange)="calendarValue.set($event)"
      />

      <!-- Checkbox -->
      <div>
        <awd-checkbox
          [value]="checkboxValue()"
          [allowIndeterminate]="true"
          (valueChange)="checkboxValue.set($event)"
        />
        <span>Check me</span>
      </div>

      <!-- Chip -->
      <awd-chip [closable]="true">Chip</awd-chip>

      <!-- Defer -->
      <awd-defer [open]="true" [lazyContent]="deferContent" />
      <ng-template #deferContent>Deferred content</ng-template>

      <!-- Dialog -->
      <button ngnButton kind="primary" (click)="dialogOpen.set(true)">Open dialog</button>
      <awd-dialog
        title="Example dialog"
        [open]="dialogOpen()"
        (openChange)="dialogOpen.set($event)"
      >
        <ng-template #content>Dialog content</ng-template>
      </awd-dialog>

      <!-- EditInplace -->
      <awd-edit-inplace [value]="editInplaceValue()" (valueChange)="editInplaceValue.set($event)" />

      <!-- Filter -->
      <awd-filter [data]="filterData()" dataType="string" />

      <!-- Icon -->
      <awd-icon [icon]="userIcon" />

      <!-- Inplace -->
      <awd-inplace>
        <ng-template #display>Display</ng-template>
        <ng-template #content let-content>
          <button ngnButton kind="primary" (click)="content.close()">Close</button>
        </ng-template>
      </awd-inplace>

      <!-- Input -->
      <input ngnInput />

      <!-- InputField -->
      <awd-input-field label="Label">
        <input ngnInput />
      </awd-input-field>

      <!-- MaskInput -->
      <awd-mask-input [mask]="'time'">
        <input ngnInput />
      </awd-mask-input>

      <!-- ItemView -->
      <awd-item-view [items]="items()" [idField]="'testId'">
        <ng-template #item let-item>{{ item.label }}</ng-template>
      </awd-item-view>

      <!-- ListBox -->
      <awd-list-box [items]="items()" style="display: block;" />

      <!-- Message -->
      <awd-message kind="outlined" [icon]="userIcon">Test message</awd-message>

      <!-- Popover -->
      <button #popoverAnchor ngnButton>Toggle</button>
      <awd-popover #popover [anchor]="popoverAnchor">Popover content</awd-popover>
      <button ngnButton kind="primary" (click)="popover.show()">Open popover</button>

      <!-- Progress -->
      <awd-progress [value]="50" />

      <!-- Scroller -->
      <awd-scroller [items]="items()" style="height: 100px;">
        <ng-template #item let-item>
          <div [ngnScrollerItem]="item" style="height: 30px;">
            {{ item.label }}
          </div>
        </ng-template>
      </awd-scroller>

      <!-- Select -->
      <awd-select [options]="items()" />

      <!-- Slider -->
      <awd-slider />

      <!-- Spinner -->
      <awd-spinner [size]="48" [thickness]="'4px'" [centered]="true" />

      <!-- Splitter -->
      <awd-splitter
        [layout]="splitterLayout()"
        (layoutChange)="splitterLayout.set($event)"
        style="height: 200px; display: block;"
      >
        <awd-splitter-panel>Panel 1</awd-splitter-panel>
        <awd-splitter-panel>Panel 2</awd-splitter-panel>
      </awd-splitter>

      <!-- Tabs -->
      <awd-tabs>
        <awd-tab tabId="tab1">
          <ng-template #header>Tab 1</ng-template>
          <ng-template #content>Tab Content 1</ng-template>
        </awd-tab>
        <awd-tab tabId="tab2">
          <ng-template #header>Tab 2</ng-template>
          <ng-template #content>Tab Content 2</ng-template>
        </awd-tab>
      </awd-tabs>

      <!-- Table -->
      <awd-table #table [rows]="tableRows()" [fieldId]="'id'" style="height: 200px">
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
      </awd-table>

      <!-- Tag -->
      <awd-tag kind="pill" [icon]="userIcon">Tag</awd-tag>

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
  public readonly splitterLayout = signal<'horizontal' | 'vertical'>('horizontal');

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
