import { Component } from '@angular/core';
import { NgnBadge } from '@awdlab/jig/badge';
import { NgnButton } from '@awdlab/jig/button';

@Component({
  selector: 'awd-demo-badge-color',
  imports: [NgnBadge, NgnButton],
  template: `
    <div class="flex gap-8 p-6">
      <button ngnButton [ngnBadge]="3" ngnBadgeColor="#e11d48">Alerts</button>
      <button ngnButton [ngnBadge]="7" ngnBadgeColor="var(--awd-color-success-500)">Done</button>
    </div>
  `,
})
export class Demo_Badge_Color {}
