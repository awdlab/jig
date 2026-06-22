import { HttpClient } from '@angular/common/http';
import { Component, effect, inject, input, ViewContainerRef, DestroyRef } from '@angular/core';

import { renderMd } from './render-md';

import type { MdCfg } from './types';

@Component({
  selector: 'ngn-md',
  template: '',
  styleUrl: 'md.scss',
  host: {
    ngSkipHydration: 'true',
  },
})
export class Md {
  private readonly _http = inject(HttpClient);
  private readonly _vcr = inject(ViewContainerRef);
  private readonly _destroyRef = inject(DestroyRef);

  public readonly cfg = input.required<MdCfg>();

  constructor() {
    effect(() => {
      const cfg = this.cfg();
      this._vcr.clear();
      renderMd(this._destroyRef, this._vcr, this._http, cfg);
    });
  }
}
