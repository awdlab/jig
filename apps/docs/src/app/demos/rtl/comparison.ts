import { Component } from '@angular/core';
import { JigBadge } from '@awdlab/jig/badge';
import { JigButton } from '@awdlab/jig/button';
import { JigIcon } from '@awdlab/jig/icon';
import { JigPaginator } from '@awdlab/jig/paginator';
import { JigProgress } from '@awdlab/jig/progress';
import tablerBell from '@iconify/icons-tabler/bell';

/**
 * The same markup rendered in both directions, so the mirroring is visible without
 * flipping the whole page: badge overhang, paginator arrows and progress fill all
 * follow the inline axis.
 */
@Component({
  selector: 'jig-demo-rtl-comparison',
  imports: [JigBadge, JigButton, JigIcon, JigPaginator, JigProgress],
  template: `
    <div class="grid gap-6 p-4 md:grid-cols-2">
      @for (dir of dirs; track dir) {
        <section [dir]="dir" class="flex flex-col gap-4">
          <span class="text-xs font-medium text-(--jig-color-surface-600)"> dir="{{ dir }}" </span>
          <div class="flex items-center gap-6">
            <button jigButton kind="icon" [jigBadge]="8" aria-label="Notifications">
              <jig-icon [icon]="bell" />
            </button>
            <button jigButton>{{ dir === 'rtl' ? 'إرسال' : 'Send' }}</button>
          </div>
          <jig-progress [value]="35" />
          <jig-paginator [totalItems]="120" [pageSize]="10" />
        </section>
      }
    </div>
  `,
})
export class Demo_Rtl_Comparison {
  protected readonly bell = tablerBell;
  protected readonly dirs = ['ltr', 'rtl'] as const;
}
