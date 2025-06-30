import { Component, signal } from '@angular/core';
import { Dialog } from '@ngneers/controls/dialog';
import { Select } from '@ngneers/controls/select';

@Component({
  templateUrl: 'playground.html',
  styleUrl: 'playground.scss',
  imports: [Dialog, Select],
})
export class PlaygroundComponent {
  constructor() {}

  protected readonly dialogOpen = signal(false);

  protected readonly options = [
    { id: 'de', label: 'Germany' },
    { id: 'fr', label: 'France' },
    { id: 'es', label: 'Spain' },
  ];
}
