import {
  Component,
  computed,
  inject,
  Injector,
  runInInjectionContext,
  signal,
} from '@angular/core';
import tablerCalendar from '@iconify/icons-tabler/calendar';
import tablerDotsVertical from '@iconify/icons-tabler/dots-vertical';
import tablerDownload from '@iconify/icons-tabler/download';
import tablerEdit from '@iconify/icons-tabler/edit';
import tablerEye from '@iconify/icons-tabler/eye';
import tablerSearch from '@iconify/icons-tabler/search';
import tablerTrash from '@iconify/icons-tabler/trash';
import { JigTemplate } from '@awdlab/jig/api/ng';
import { JigAvatar } from '@awdlab/jig/avatar';
import { type BreadcrumbItem, JigBreadcrumb } from '@awdlab/jig/breadcrumb';
import { JigButton } from '@awdlab/jig/button';
import { JigChip } from '@awdlab/jig/chip';
import { createDialog } from '@awdlab/jig/dialog';
import { JigIcon } from '@awdlab/jig/icon';
import { JigInput } from '@awdlab/jig/input';
import { JigInputField } from '@awdlab/jig/input-field';
import { type MenuItem, JigMenu } from '@awdlab/jig/menu';
import { type MeterItem, JigMeter } from '@awdlab/jig/meter';
import { JigPaginator } from '@awdlab/jig/paginator';
import { JigSelect } from '@awdlab/jig/select';
import { createConditionalSpinner } from '@awdlab/jig/spinner';
import { JigTableModule } from '@awdlab/jig/table';
import { JigTag } from '@awdlab/jig/tag';
import { injectToastCreator } from '@awdlab/jig/toast';
import { JigTooltip } from '@awdlab/jig/tooltip';

import {
  createOpportunity,
  DATE_RANGE_OPTIONS,
  type DealDraft,
  KPIS,
  matchesFilter,
  type Opportunity,
  OPPORTUNITIES,
  type OpportunityFilter,
  STAGE_ORDER,
  stageColor,
} from './data';
import { QuickAddDeal } from './quick-add-deal';
import { themeColor } from '../../utils/theme-variant';

@Component({
  selector: 'jig-docs-sales-crm',
  templateUrl: './sales-crm.html',
  imports: [
    JigAvatar,
    JigBreadcrumb,
    JigButton,
    JigChip,
    JigIcon,
    JigInput,
    JigInputField,
    JigMenu,
    JigMeter,
    JigPaginator,
    JigSelect,
    JigTableModule,
    JigTag,
    JigTemplate,
    JigTooltip,
    QuickAddDeal,
  ],
})
export class SalesCrm {
  private readonly _injector = inject(Injector);
  private readonly _toastCreator = injectToastCreator();

  protected readonly kpis = KPIS;
  protected readonly dateRangeOptions = DATE_RANGE_OPTIONS;

  protected readonly downloadIcon = tablerDownload;
  protected readonly calendarIcon = tablerCalendar;
  protected readonly searchIcon = tablerSearch;
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
  protected readonly activeFilter = signal<OpportunityFilter>('all');
  protected readonly search = signal('');

  protected readonly pageSize = 5;
  protected readonly page = signal(0);

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

  /** Value per stage across the rows currently in view — it follows filter, search and new deals. */
  protected readonly pipeline = computed<MeterItem[]>(() => {
    const rows = this.filtered();
    return STAGE_ORDER.map(stage => ({
      label: stage,
      value: rows.filter(row => row.status === stage).reduce((sum, row) => sum + row.value, 0),
      color: stageColor(stage),
    })).filter(item => item.value > 0);
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
    // Resolve the destructive color against the CURRENT theme each time the dialog opens (the live
    // theme picker can switch themes at runtime). Delete gets the destructive color under Shade; no
    // special color under Nova (its default). `themeColor` reads `ThemeService` via `inject`, so it
    // must run in an injection context — this handler is invoked outside one.
    const errorColor = runInInjectionContext(this._injector, () =>
      themeColor({ Shade: 'destructive' })
    );
    const dialog = createDialog(this._injector, {
      title: 'Delete Deal',
      content: `Are you sure you want to delete ${row.company}? This action cannot be undone.`,
      modal: true,
      size: { width: '400px', maxWidth: '90vw' },
      footerButtons: [
        { label: 'Cancel', kind: 'secondary', value: 'cancel' as const },
        { label: 'Delete', color: errorColor, value: 'delete' as const },
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
    return `var(--jig-color-${name}-${shade})`;
  }
}
