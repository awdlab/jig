import { Injectable, signal } from '@angular/core';

import type { BreadcrumbItem } from '@awdlab/jig/breadcrumb';

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  public readonly items = signal<BreadcrumbItem[]>([]);

  public set(items: BreadcrumbItem[]) {
    this.items.set(items);
  }

  public clear() {
    this.items.set([]);
  }
}
