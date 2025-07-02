import {
  afterRenderEffect,
  Component,
  inject,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgnItem, NgnTemplate, templateTypeFn } from '@ngneers/controls/api';
import { IconType } from '@ngneers/controls/custom-types';
import { Dialog } from '@ngneers/controls/dialog';
import { GlobalIconTemplate, IconTemplateData } from '@ngneers/controls/icon';
import { ListBox } from '@ngneers/controls/list-box';
import { Scroller } from '@ngneers/controls/scroller';
import { Select, SelectFilterFn } from '@ngneers/controls/select';
@Component({
  templateUrl: 'playground.html',
  styleUrl: 'playground.scss',
  imports: [FormsModule, Dialog, Select, NgnTemplate, Scroller, ListBox],
})
export class PlaygroundComponent {
  private readonly _globalIconTemplate = inject(GlobalIconTemplate);
  private readonly _iconTemplate =
    viewChild.required<TemplateRef<IconTemplateData>>('iconTemplate');

  constructor() {
    afterRenderEffect(() => {
      this._globalIconTemplate.setGlobalIconTemplate(this._iconTemplate());
    });
  }

  protected readonly filterFn: SelectFilterFn<(typeof this.options)[number]> = (
    searchText,
    item
  ) => {
    return item.label.toLowerCase().includes(searchText.toLowerCase());
  };

  protected readonly dialogOpen = signal(false);

  protected readonly options: NgnItem[] = [
    {
      value: 'europe',
      label: 'Europe',
      items: [
        { value: 'france', label: 'France' },
        { value: 'germany', label: 'Germany' },
        { value: 'spain', label: 'Spain' },
      ],
    },
    {
      value: 'asia',
      label: 'Asia',
      items: [
        { value: 'japan', label: 'Japan' },
        { value: 'china', label: 'China' },
        { value: 'india', label: 'India' },
      ],
    },
    {
      value: 'america',
      label: 'America',
      items: [
        { value: 'usa', label: 'United States of America' },
        { value: 'canada', label: 'Canada' },
        { value: 'brazil', label: 'Brazil' },
      ],
    },
  ] as const;
  protected selectedItem = signal<(typeof this.options)[number]['value']>(this.options[0].value);

  protected readonly iconType = templateTypeFn<IconType>();

  protected readonly items = Array.from({ length: 1000 }, (_, i) => ({
    label: `Item ${i + 1}`,
    value: i + 1,
  }));
}
