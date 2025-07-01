import {
  afterRenderEffect,
  Component,
  inject,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgnTemplate, templateTypeFn } from '@ngneers/controls/api';
import { IconType } from '@ngneers/controls/custom-types';
import { Dialog } from '@ngneers/controls/dialog';
import { Select } from '@ngneers/controls/select';
import { GlobalIconTemplate } from 'packages/controls/src/icon/global-icon-template';

@Component({
  templateUrl: 'playground.html',
  styleUrl: 'playground.scss',
  imports: [FormsModule, Dialog, Select, NgnTemplate],
})
export class PlaygroundComponent {
  private readonly _globalIconTemplate = inject(GlobalIconTemplate);
  private readonly _iconTemplate = viewChild.required<TemplateRef<unknown>>('iconTemplate');

  constructor() {
    afterRenderEffect(() => {
      this._globalIconTemplate.setGlobalIconTemplate(this._iconTemplate());
    });
  }

  protected readonly dialogOpen = signal(false);

  protected readonly options = [
    {
      id: 'europe',
      label: 'Europe',
      children: [
        { id: 'france', label: 'France' },
        { id: 'germany', label: 'Germany' },
        { bullshit: true },
      ],
    },
    {
      id: 'asia',
      label: 'Asia',
      children: [
        { id: 'japan', label: 'Japan' },
        { id: 'china', label: 'China' },
        { id: 'india', label: 'India' },
      ],
    },
    {
      id: 'america',
      label: 'America',
      children: [
        { id: 'usa', label: 'USA' },
        { id: 'canada', label: 'Canada' },
        { id: 'brazil', label: 'Brazil' },
      ],
    },
  ] as const;
  protected selectedItem = signal<(typeof this.options)[number]['id']>(this.options[0].id);

  protected readonly iconType = templateTypeFn<IconType>();
}
