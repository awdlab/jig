import { Component, input, linkedSignal, model, signal } from '@angular/core';
import { JigHint } from '@awdlab/jig/hint';
import { JigInput } from '@awdlab/jig/input';
import { JigInputField } from '@awdlab/jig/input-field';

import { validateAgainstType } from '../../../../validate';

import type { TypeDeclaration } from '../../../../type-model';

@Component({
  selector: 'jig-docs-playground-json-input',
  templateUrl: 'json-input.html',
  imports: [JigInputField, JigInput, JigHint],
  host: { class: 'block' },
})
export class JigDocsPlaygroundJsonInput {
  public readonly type = input.required<TypeDeclaration>();
  public readonly value = model<unknown>();

  protected readonly text = linkedSignal(() => JSON.stringify(this.value() ?? null, null, 2));
  protected readonly error = signal<string | null>(null);

  protected commit(raw: string): void {
    this.text.set(raw);

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : 'Invalid JSON');
      return;
    }

    const invalid = validateAgainstType(parsed, this.type());
    this.error.set(invalid);
    if (!invalid) {
      this.value.set(parsed);
    }
  }
}
