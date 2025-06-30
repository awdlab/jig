import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgnTemplate, templateTypeFn } from '@ngneers/controls/api';
import { IconType } from '@ngneers/controls/custom-types';
import { Dialog } from '@ngneers/controls/dialog';
import { Select } from '@ngneers/controls/select';

@Component({
  templateUrl: 'playground.html',
  styleUrl: 'playground.scss',
  imports: [FormsModule, Dialog, Select, NgnTemplate],
})
export class PlaygroundComponent {
  constructor() {}

  protected readonly dialogOpen = signal(false);

  protected readonly options = [
    { id: 'de', label: 'Germany' },
    { id: 'fr', label: 'France' },
    { id: 'es', label: 'Spain' },
  ] as const;
  protected selectedItem = signal<(typeof this.options)[number]['id']>(this.options[0].id);

  protected readonly iconType = templateTypeFn<IconType>();
}
