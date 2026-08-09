import {
  Component,
  ChangeDetectionStrategy,
  signal,
  type OnInit,
  type OnDestroy,
} from '@angular/core';
import tablerUser from '@iconify/icons-tabler/user';
import { AwdAccordion, AwdAccordionPanel } from '@awdlab/jig/accordion';
import { AwdTemplate } from '@awdlab/jig/api/ng';
import { AwdAvatar, AwdAvatarGroup } from '@awdlab/jig/avatar';
import { AwdBreadcrumb } from '@awdlab/jig/breadcrumb';
import { AwdButton } from '@awdlab/jig/button';
import { AwdButtonGroup } from '@awdlab/jig/button-group';
import { AwdCalendar } from '@awdlab/jig/calendar';
import { AwdCheckbox } from '@awdlab/jig/checkbox';
import { AwdChip } from '@awdlab/jig/chip';
import { AwdDefer } from '@awdlab/jig/defer';
import { AwdDialog } from '@awdlab/jig/dialog';
import { AwdEditInplace } from '@awdlab/jig/edit-inplace';
import { AwdFilter } from '@awdlab/jig/filter';
import { AwdIcon } from '@awdlab/jig/icon';
import { AwdInplace } from '@awdlab/jig/inplace';
import { AwdInput } from '@awdlab/jig/input';
import { AwdInputField } from '@awdlab/jig/input-field';
import { AwdMaskInput } from '@awdlab/jig/mask-input';
import { JigItemView } from '@awdlab/jig/item-view';
import { AwdListBox } from '@awdlab/jig/list-box';
import { AwdMessage } from '@awdlab/jig/message';
import { AwdPopover } from '@awdlab/jig/popover';
import { AwdProgress } from '@awdlab/jig/progress';
import { AwdScroller, AwdScrollerItem } from '@awdlab/jig/scroller';
import { AwdSelect } from '@awdlab/jig/select';
import { AwdSlider } from '@awdlab/jig/slider';
import { AwdSpinner } from '@awdlab/jig/spinner';
import { AwdSplitter, AwdSplitterPanel } from '@awdlab/jig/splitter';
import { AwdTableModule } from '@awdlab/jig/table';
import { AwdTab, AwdTabs } from '@awdlab/jig/tabs';
import { AwdTag } from '@awdlab/jig/tag';
import { AwdTooltip } from '@awdlab/jig/tooltip';

import type { JigItem } from '@awdlab/jig/api';

declare global {
  interface Window {
    __leak_test_component?: unknown;
  }
}

@Component({
  selector: 'jig-leak-test',

  imports: [
    AwdTemplate,
    AwdAccordion,
    AwdAccordionPanel,
    AwdAvatar,
    AwdAvatarGroup,
    AwdBreadcrumb,
    AwdButton,
    AwdButtonGroup,
    AwdCalendar,
    AwdCheckbox,
    AwdChip,
    AwdDefer,
    AwdDialog,
    AwdEditInplace,
    AwdFilter,
    AwdIcon,
    AwdInplace,
    AwdInput,
    AwdInputField,
    AwdMaskInput,
    JigItemView,
    AwdListBox,
    AwdMessage,
    AwdPopover,
    AwdProgress,
    AwdScroller,
    AwdScrollerItem,
    AwdSelect,
    AwdSlider,
    AwdSpinner,
    AwdSplitter,
    AwdSplitterPanel,
    AwdTab,
    AwdTabs,
    AwdTableModule,
    AwdTag,
    AwdTooltip,
  ],
  template: `
    @if (show()) {
      <!-- Accordion with panels -->
      <jig-accordion>
        <jig-accordion-panel panelId="panel1" header="Panel 1">
          <ng-template #content>Content 1</ng-template>
        </jig-accordion-panel>
      </jig-accordion>

      <!-- Avatar & AvatarGroup -->
      <jig-avatar initials="AB" />
      <jig-avatar-group>
        <jig-avatar initials="A1" />
        <jig-avatar initials="A2" />
      </jig-avatar-group>

      <!-- Breadcrumb -->
      <jig-breadcrumb [items]="breadcrumbItems()" />

      <!-- Button & ButtonGroup -->
      <button ngnButton kind="primary">Click me</button>
      <jig-button-group>
        <button ngnButton kind="primary">Button 1</button>
        <button ngnButton kind="primary">Button 2</button>
      </jig-button-group>

      <!-- Calendar -->
      <jig-calendar
        [inline]="true"
        [value]="calendarValue()"
        (valueChange)="calendarValue.set($event)"
      />

      <!-- Checkbox -->
      <div>
        <jig-checkbox
          [value]="checkboxValue()"
          [allowIndeterminate]="true"
          (valueChange)="checkboxValue.set($event)"
        />
        <span>Check me</span>
      </div>

      <!-- Chip -->
      <jig-chip [closable]="true">Chip</jig-chip>

      <!-- Defer -->
      <jig-defer [open]="true" [lazyContent]="deferContent" />
      <ng-template #deferContent>Deferred content</ng-template>

      <!-- Dialog -->
      <button ngnButton kind="primary" (click)="dialogOpen.set(true)">Open dialog</button>
      <jig-dialog
        title="Example dialog"
        [open]="dialogOpen()"
        (openChange)="dialogOpen.set($event)"
      >
        <ng-template #content>Dialog content</ng-template>
      </jig-dialog>

      <!-- EditInplace -->
      <jig-edit-inplace [value]="editInplaceValue()" (valueChange)="editInplaceValue.set($event)" />

      <!-- Filter -->
      <jig-filter [data]="filterData()" dataType="string" />

      <!-- Icon -->
      <jig-icon [icon]="userIcon" />

      <!-- Inplace -->
      <jig-inplace>
        <ng-template #display>Display</ng-template>
        <ng-template #content let-content>
          <button ngnButton kind="primary" (click)="content.close()">Close</button>
        </ng-template>
      </jig-inplace>

      <!-- Input -->
      <input ngnInput />

      <!-- InputField -->
      <jig-input-field label="Label">
        <input ngnInput />
      </jig-input-field>

      <!-- MaskInput -->
      <jig-mask-input [mask]="'time'">
        <input ngnInput />
      </jig-mask-input>

      <!-- ItemView -->
      <jig-item-view [items]="items()" [idField]="'testId'">
        <ng-template #item let-item>{{ item.label }}</ng-template>
      </jig-item-view>

      <!-- ListBox -->
      <jig-list-box [items]="items()" style="display: block;" />

      <!-- Message -->
      <jig-message kind="outlined" [icon]="userIcon">Test message</jig-message>

      <!-- Popover -->
      <button #popoverAnchor ngnButton>Toggle</button>
      <jig-popover #popover [anchor]="popoverAnchor">Popover content</jig-popover>
      <button ngnButton kind="primary" (click)="popover.show()">Open popover</button>

      <!-- Progress -->
      <jig-progress [value]="50" />

      <!-- Scroller -->
      <jig-scroller [items]="items()" style="height: 100px;">
        <ng-template #item let-item>
          <div [ngnScrollerItem]="item" style="height: 30px;">
            {{ item.label }}
          </div>
        </ng-template>
      </jig-scroller>

      <!-- Select -->
      <jig-select [options]="items()" />

      <!-- Slider -->
      <jig-slider />

      <!-- Spinner -->
      <jig-spinner [size]="48" [thickness]="'4px'" [centered]="true" />

      <!-- Splitter -->
      <jig-splitter
        [layout]="splitterLayout()"
        (layoutChange)="splitterLayout.set($event)"
        style="height: 200px; display: block;"
      >
        <jig-splitter-panel>Panel 1</jig-splitter-panel>
        <jig-splitter-panel>Panel 2</jig-splitter-panel>
      </jig-splitter>

      <!-- Tabs -->
      <jig-tabs>
        <jig-tab tabId="tab1">
          <ng-template #header>Tab 1</ng-template>
          <ng-template #content>Tab Content 1</ng-template>
        </jig-tab>
        <jig-tab tabId="tab2">
          <ng-template #header>Tab 2</ng-template>
          <ng-template #content>Tab Content 2</ng-template>
        </jig-tab>
      </jig-tabs>

      <!-- Table -->
      <jig-table #table [rows]="tableRows()" [fieldId]="'id'" style="height: 200px">
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
      </jig-table>

      <!-- Tag -->
      <jig-tag kind="pill" [icon]="userIcon">Tag</jig-tag>

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

  public readonly items = signal<readonly JigItem<unknown, number>[]>([
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
