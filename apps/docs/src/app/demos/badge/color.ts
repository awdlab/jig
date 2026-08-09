import { Component } from '@angular/core';
import { JigBadge } from '@awdlab/jig/badge';
import { JigButton } from '@awdlab/jig/button';

@Component({
  selector: 'jig-demo-badge-color',
  imports: [JigBadge, JigButton],
  template: `
    <div class="flex gap-8 p-6">
      <button jigButton [jigBadge]="3" jigBadgeColor="#e11d48">Alerts</button>
      <button jigButton [jigBadge]="7" jigBadgeColor="var(--jig-color-success-500)">Done</button>
    </div>
  `,
})
export class Demo_Badge_Color {}
