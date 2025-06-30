import { Component } from '@angular/core';
import { NgnTemplate } from '@ngneers/controls/api';
import { Select } from '@ngneers/controls/select';

@Component({
  imports: [Select, NgnTemplate],
  template: `
    <ngn-select
      #select
      [popoverOptions]="{
        sizeConstraints: { width: 1, maxWidth: 1.5, maxHeight: '150px' },
      }"
      fieldId="id"
      fieldLabel="label"
      [options]="options"
    >
      <ng-template #item [ngnTemplate]="select.templateTypes.item" let-option>
        <span>{{ option?.label }}</span> Test
      </ng-template>
    </ngn-select>
  `,
})
export class Select_Base_Component {
  constructor() {}

  public readonly options = [
    { id: 'de', label: 'Germany' },
    { id: 'fr', label: 'France' },
    { id: 'es', label: 'Spain' },
    { id: 'it', label: 'Italy' },
    { id: 'us', label: 'United States' },
    { id: 'uk', label: 'United Kingdom' },
    { id: 'jp', label: 'Japan' },
  ];
}
