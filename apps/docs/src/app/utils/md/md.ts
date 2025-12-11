import { HttpClient } from '@angular/common/http';
import {
  Component,
  effect,
  inject,
  input,
  ViewContainerRef,
  ChangeDetectionStrategy,
} from '@angular/core';

import { renderMd } from './render-md';
import { MdCfg } from './types';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  public readonly cfg = input.required<MdCfg>();

  constructor() {
    effect(() => {
      const cfg = this.cfg();
      this._vcr.clear();
      renderMd(this._vcr, this._http, cfg);
    });
  }
}
