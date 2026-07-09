import { Component, inject } from '@angular/core';
import { ColorSchemeService } from '@ngneers/controls/api/ng';
import { NgnSelectButton } from '@ngneers/controls/select-button';

/**
 * Drives the global color scheme through {@link ColorSchemeService}. Changing the
 * selection re-themes the whole docs site — that's the point: one class on
 * `<html>` flips every control.
 */
@Component({
  selector: 'ngn-demo-dark-mode-toggle',
  imports: [NgnSelectButton],
  template: `
    <div class="flex flex-col gap-3">
      <ngn-select-button
        [options]="options"
        [value]="scheme.preference()"
        (valueChange)="scheme.set($event)"
      />
      <p class="m-0">
        preference: <strong>{{ scheme.preference() }}</strong> · resolved:
        <strong>{{ scheme.resolved() }}</strong> · isDark:
        <strong>{{ scheme.isDark() }}</strong>
      </p>
    </div>
  `,
})
export class Demo_DarkMode_Toggle {
  protected readonly scheme = inject(ColorSchemeService);

  protected readonly options = [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
    { label: 'System', value: 'system' },
  ] as const;
}
