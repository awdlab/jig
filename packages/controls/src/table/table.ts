import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgnTemplate } from '@ngneers/controls/api/ng';
import { provideSelf } from '@ngneers/controls/base';
import { NgnScroller } from '@ngneers/controls/scroller';
import { tableControlTemplate } from '@ngneers/controls-themes/templates/table';

import { NgnTableTemplates } from './table-templates';

@Component({
  selector: 'ngn-table',
  templateUrl: './table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, NgnScroller, NgnTemplate],
  providers: [provideSelf(NgnTable)],
  host: {
    '[class]': `theme.classes({
      '': true,
    })`,
    role: 'table',
  },
})
export class NgnTable<T extends object[], K extends keyof T[number]> extends NgnTableTemplates<T> {
  protected readonly theme = this.injectThemeTemplate(tableControlTemplate);

  public readonly rows = input.required<T>();
  public readonly rowHeight = input<number>();
  public readonly fieldId = input.required<K>();
  public readonly virtual = input<boolean>(false);

  protected readonly rowsWithHeaderDummy = computed(() => [
    { sticky: true } as T[number] | { sticky: true },
    ...this.rows(),
  ]);
  protected readonly trackById = (item: T[number]): unknown => item[this.fieldId()];
}
