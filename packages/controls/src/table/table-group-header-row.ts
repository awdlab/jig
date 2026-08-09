import { Directive, effect, ElementRef, inject, input } from '@angular/core';
import { injectThemeTemplate } from '@awdlab/jig/api/ng';
import { JigScrollerItem } from '@awdlab/jig/scroller';
import { toggleClass } from '@awdlab/jig/utils';
import { setInputSignalValue } from '@awdlab/jig/utils-ng';
import { tableControlTemplate } from '@awdlab/jig-themes/templates/table';

import type { FormattedTableGroupHeaderRow } from './types';

/**
 * The `<tr>` that renders a group header when the table is grouped via
 * `groupBy`. Bind it to the group-header row the `#groupHeader` template
 * receives.
 *
 * @category directive
 */
@Directive({
  selector: '[ngnTableGroupHeaderTr]',
  host: {
    '[attr.aria-rowindex]': 'ngnTableGroupHeaderTr().index + 2',
    '[style.--jig-table-row-index]': 'ngnTableGroupHeaderTr().index + 2',
  },
})
export class JigTableGroupHeaderTr extends JigScrollerItem {
  /** The group-header row this `<tr>` renders. */
  public readonly ngnTableGroupHeaderTr = input.required<FormattedTableGroupHeaderRow>();
  /** The item bound to the underlying scroller entry; kept in sync with {@link ngnTableGroupHeaderTr}. */
  public override readonly ngnScrollerItem = input<object>({});
  private readonly _element = inject(ElementRef<HTMLElement>);
  protected readonly theme = injectThemeTemplate(tableControlTemplate);

  constructor() {
    super();
    effect(() => {
      const row = this.ngnTableGroupHeaderTr();
      setInputSignalValue(this.ngnScrollerItem, row);
    });
    this.prepareDom();
  }

  private prepareDom() {
    toggleClass(this._element.nativeElement, this.theme.class('row'), true);
    toggleClass(this._element.nativeElement, this.theme.class('group-header-row'), true);
  }
}
