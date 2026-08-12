import { Component } from '@angular/core';
import { JigInputField } from '@awdlab/jig/input-field';
import { JigTagInput } from '@awdlab/jig/tag-input';

const CATALOGUE = [
  'accessibility',
  'angular',
  'design',
  'documentation',
  'frontend',
  'performance',
  'signals',
  'testing',
];

@Component({
  selector: 'jig-demo-tag-input-suggestions-async',
  imports: [JigInputField, JigTagInput],
  template: `
    <jig-input-field [label]="'Labels'" [labelKind]="'on'" inputId="tag-async">
      <jig-tag-input
        inputId="tag-async"
        [delimiters]="','"
        [suggestions]="lookup"
        [suggestionsDebounce]="300"
      />
    </jig-input-field>
  `,
  host: { class: 'w-72' },
})
export class Demo_TagInput_SuggestionsAsync {
  /**
   * A callback owns its own filtering — it receives the typed text and the tags
   * already added, so it can ask a server for exactly what it needs.
   */
  protected readonly lookup = async (text: string, tags: readonly string[]) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const query = text.trim().toLowerCase();
    return CATALOGUE.filter(
      entry => !tags.includes(entry) && (!query || entry.includes(query))
    ).slice(0, 5);
  };
}
