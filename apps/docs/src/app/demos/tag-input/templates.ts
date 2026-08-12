import { Component, signal } from '@angular/core';
import { JigTemplate } from '@awdlab/jig/api/ng';
import { JigAvatar } from '@awdlab/jig/avatar';
import { JigInputField } from '@awdlab/jig/input-field';
import { JigTagInput } from '@awdlab/jig/tag-input';

/** Initials for an address like `ada.lovelace@example.com` → `AL`. */
function initialsOf(email: string): string {
  const [name = ''] = email.split('@');
  const parts = name.split(/[._-]+/).filter(Boolean);
  return parts
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? '')
    .join('');
}

@Component({
  selector: 'jig-demo-tag-input-templates',
  imports: [JigInputField, JigTagInput, JigTemplate, JigAvatar],
  template: `
    <jig-input-field [label]="'Recipients'" [labelKind]="'on'" inputId="tag-templates">
      <jig-tag-input
        #tags
        inputId="tag-templates"
        [delimiters]="',; '"
        [suggestions]="directory"
        [value]="value()"
        (valueChange)="value.set($event)"
      >
        <ng-template #tag let-recipient [jigTemplate]="tags.templateTypes.tag">
          <jig-avatar [initials]="initialsOf(recipient)" [size]="16" />
          <span>{{ recipient }}</span>
        </ng-template>
      </jig-tag-input>
    </jig-input-field>
  `,
  host: { class: 'w-96' },
})
export class Demo_TagInput_Templates {
  protected readonly initialsOf = initialsOf;
  protected readonly value = signal<string[] | null>(['ada.lovelace@example.com']);
  protected readonly directory = [
    'ada.lovelace@example.com',
    'grace.hopper@example.com',
    'alan.turing@example.com',
    'katherine.johnson@example.com',
  ];
}
