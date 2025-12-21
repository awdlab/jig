import { NgTemplateOutlet, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgnTemplate } from '@ngneers/controls/api/ng';
import { provideSelf } from '@ngneers/controls/base';
import { NgnScroller } from '@ngneers/controls/scroller';
import { tableControlTemplate } from '@ngneers/controls-themes/templates/table';

import { NgnTableTemplates } from './table-templates';
import { FormattedTableRow } from './types';

@Component({
  selector: 'ngn-table',
  templateUrl: './table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, NgnScroller, NgnTemplate, NgClass],
  providers: [provideSelf(NgnTable)],
  host: {
    '[class]': `theme.classes({
      '': true,
    })`,
    role: 'table',
    '[attr.aria-rowcount]': 'rows().length',
    tabindex: '0',
  },
})
export class NgnTable<T extends object, K extends keyof T> extends NgnTableTemplates<T> {
  protected readonly theme = this.injectThemeTemplate(tableControlTemplate);

  public readonly rows = input.required<T[]>();
  public readonly rowHeight = input<number>();
  public readonly fieldId = input.required<K>();
  public readonly virtual = input<boolean>(false);

  protected readonly trackById = (item: T): unknown => item[this.fieldId()];

  protected readonly formattedRows = computed<FormattedTableRow<T>[]>(() => {
    const rows = this.rows();
    return rows.map((data, index) => ({
      kind: 'data' as const,
      id: data[this.fieldId()] as T[keyof T] & (string | number),
      data,
      index,
    }));
  });
}
