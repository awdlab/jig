import { Component, computed, inject, Injector, signal } from '@angular/core';
import tablerCalendar from '@iconify/icons-tabler/calendar';
import tablerDotsVertical from '@iconify/icons-tabler/dots-vertical';
import tablerDownload from '@iconify/icons-tabler/download';
import tablerEdit from '@iconify/icons-tabler/edit';
import tablerEye from '@iconify/icons-tabler/eye';
import tablerInfoCircle from '@iconify/icons-tabler/info-circle';
import tablerReportAnalytics from '@iconify/icons-tabler/report-analytics';
import tablerSearch from '@iconify/icons-tabler/search';
import tablerTrash from '@iconify/icons-tabler/trash';
import { NgnAccordion, NgnAccordionPanel } from '@ngneers/controls/accordion';
import { NgnTemplate } from '@ngneers/controls/api/ng';
import { NgnAvatar } from '@ngneers/controls/avatar';
import { type BreadcrumbItem, NgnBreadcrumb } from '@ngneers/controls/breadcrumb';
import { NgnButton } from '@ngneers/controls/button';
import { NgnChip } from '@ngneers/controls/chip';
import { createDialog } from '@ngneers/controls/dialog';
import { NgnIcon } from '@ngneers/controls/icon';
import { NgnInput } from '@ngneers/controls/input';
import { NgnInputField } from '@ngneers/controls/input-field';
import { type MenuItem, NgnMenu } from '@ngneers/controls/menu';
import { NgnMessage } from '@ngneers/controls/message';
import { NgnPaginator } from '@ngneers/controls/paginator';
import { NgnProgress } from '@ngneers/controls/progress';
import { NgnSelect } from '@ngneers/controls/select';
import { NgnSlider } from '@ngneers/controls/slider';
import { createConditionalSpinner } from '@ngneers/controls/spinner';
import { NgnTableModule } from '@ngneers/controls/table';
import { NgnTag } from '@ngneers/controls/tag';
import { injectToastCreator } from '@ngneers/controls/toast';
import { NgnTooltip } from '@ngneers/controls/tooltip';

import {
  CAMPAIGNS,
  createOpportunity,
  DATE_RANGE_OPTIONS,
  type DealDraft,
  KPIS,
  matchesFilter,
  type Opportunity,
  OPPORTUNITIES,
  type OpportunityFilter,
} from './data';
import { QuickAddDeal } from './quick-add-deal';

@Component({
  selector: 'ngn-docs-sales-crm',
  templateUrl: './sales-crm.html',
  imports: [
    NgnAccordion,
    NgnAccordionPanel,
    NgnAvatar,
    NgnBreadcrumb,
    NgnButton,
    NgnChip,
    NgnIcon,
    NgnInput,
    NgnInputField,
    NgnMenu,
    NgnMessage,
    NgnPaginator,
    NgnProgress,
    NgnSelect,
    NgnSlider,
    NgnTableModule,
    NgnTag,
    NgnTemplate,
    NgnTooltip,
    QuickAddDeal,
  ],
})
export class SalesCrm {
  private readonly _injector = inject(Injector);
  private readonly _toastCreator = injectToastCreator();

  protected readonly kpis = KPIS;
  protected readonly campaigns = CAMPAIGNS;
  protected readonly dateRangeOptions = DATE_RANGE_OPTIONS;

  protected readonly downloadIcon = tablerDownload;
  protected readonly calendarIcon = tablerCalendar;
  protected readonly searchIcon = tablerSearch;
  protected readonly infoIcon = tablerInfoCircle;
  protected readonly reportIcon = tablerReportAnalytics;
  protected readonly editIcon = tablerEdit;
  protected readonly dotsIcon = tablerDotsVertical;

  protected readonly breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Dashboard', id: 'dashboard', callback: () => {} },
    { label: 'Sales', id: 'sales', callback: () => {} },
  ];

  protected readonly filterChips: ReadonlyArray<{ label: string; value: OpportunityFilter }> = [
    { label: 'All', value: 'all' },
    { label: 'High Value', value: 'highValue' },
    { label: 'Closing Soon', value: 'closingSoon' },
  ];

  protected readonly dateRange = signal<string>('oct-2024');
  protected readonly activeFilter = signal<OpportunityFilter>('highValue');
  protected readonly search = signal('');
  protected readonly expandedPanels = signal<string[]>(['q4-enterprise']);

  protected readonly pageSize = 5;
  protected readonly page = signal(0);

  protected readonly syncProgress = 78;
  protected readonly syncSpeed = signal(5);

  // -- Spinner: debounced search --
  private readonly _searchTerm = signal('');
  protected readonly loading = signal(false);
  private _searchTimeout: ReturnType<typeof setTimeout> | undefined;

  private readonly _opportunities = signal<readonly Opportunity[]>(OPPORTUNITIES);

  constructor() {
    createConditionalSpinner(this.loading, {
      element: '.sales-crm-table-area',
      debounce: false,
    });
  }

  protected readonly filtered = computed(() => {
    const term = this._searchTerm().trim().toLowerCase();
    const filter = this.activeFilter();
    return this._opportunities().filter(
      o => matchesFilter(o, filter) && (!term || o.company.toLowerCase().includes(term))
    );
  });

  protected readonly pagedRows = computed(() => {
    const skip = this.page() * this.pageSize;
    return this.filtered().slice(skip, skip + this.pageSize);
  });

  protected readonly rowsLabel = computed(() => {
    const total = this.filtered().length;
    if (total === 0) {
      return '0 of 0';
    }
    const start = this.page() * this.pageSize + 1;
    const end = Math.min(start + this.pageSize - 1, total);
    return `Rows: ${start}-${end} of ${total}`;
  });

  protected setFilter(filter: OpportunityFilter): void {
    this.activeFilter.set(filter);
    this.page.set(0);
  }

  /** Prepend a freshly captured deal and surface it at the top of the table. */
  protected addDeal(draft: DealDraft): void {
    const nextId = this._opportunities().reduce((max, o) => Math.max(max, o.id), 0) + 1;
    const opportunity = createOpportunity(nextId, draft);
    this._opportunities.update(list => [opportunity, ...list]);
    this.activeFilter.set('all');
    this._searchTerm.set('');
    this.search.set('');
    this.page.set(0);
    this._toastCreator.show({
      header: 'Deal added',
      content: `${draft.account} was added successfully.`,
    });
  }

  protected onSearch(value: string | null): void {
    this.search.set(value ?? '');
    this.page.set(0);
    clearTimeout(this._searchTimeout);
    this.loading.set(true);
    this._searchTimeout = setTimeout(() => {
      this._searchTerm.set(value ?? '');
      this.loading.set(false);
    }, 400);
  }

  /** Build menu items for a specific row. */
  protected rowMenuItems(row: Opportunity): MenuItem[] {
    return [
      { id: 'view', label: 'View Details', icon: tablerEye, callback: () => {} },
      { id: 'edit', label: 'Edit Deal', icon: tablerEdit, callback: () => {} },
      { separator: true },
      { id: 'delete', label: 'Delete', icon: tablerTrash, callback: () => this.confirmDelete(row) },
    ];
  }

  protected confirmDelete(row: Opportunity): void {
    const dialog = createDialog(this._injector, {
      title: 'Delete Deal',
      content: `Are you sure you want to delete ${row.company}? This action cannot be undone.`,
      modal: true,
      size: { width: '400px', maxWidth: '90vw' },
      footerButtons: [
        { label: 'Cancel', kind: 'secondary', value: 'cancel' as const },
        { label: 'Delete', color: 'error', value: 'delete' as const },
      ],
    });
    dialog.buttonClicked.subscribe(button => {
      dialog.close();
      if (button === 'delete') {
        this._opportunities.update(list => list.filter(o => o.id !== row.id));
        this._toastCreator.show({
          header: 'Deal removed',
          content: `${row.company} was removed.`,
        });
      }
    });
  }

  protected currency(value: number): string {
    return `$${value.toLocaleString('en-US')}`;
  }

  /** Build a theme color CSS variable from a color name + shade. */
  protected colorVar(name: string, shade = 500): string {
    return `var(--ngn-color-${name}-${shade})`;
  }
}
