import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import tablerBriefcase from '@iconify/icons-tabler/briefcase';
import tablerChartBar from '@iconify/icons-tabler/chart-bar';
import tablerClipboardList from '@iconify/icons-tabler/clipboard-list';
import { NgnButton } from '@ngneers/controls/button';
import { NgnIcon } from '@ngneers/controls/icon';
import { NgnTab, NgnTabs } from '@ngneers/controls/tabs';

import { SalesCrm } from './dashboard/sales-crm';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-docs-start',
  templateUrl: 'start.html',
  styleUrl: 'start.scss',
  imports: [NgnButton, NgnIcon, NgnTabs, NgnTab, SalesCrm],
  host: { class: 'flex min-h-full flex-col' },
})
export class Start {
  private readonly _router = inject(Router);

  protected readonly briefcaseIcon = tablerBriefcase;
  protected readonly chartIcon = tablerChartBar;
  protected readonly clipboardIcon = tablerClipboardList;

  protected getStarted(): void {
    this._router.navigate(['/components']);
  }
}
