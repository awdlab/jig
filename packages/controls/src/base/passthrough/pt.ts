import { Directive, input } from '@angular/core';

import { NgnPtEngine } from './pt-engine';
import { NgnBaseSafe } from '../base';

import type { AppliedThemeClassCfg } from '@ngneers/controls/api/ng';
import type { ControlName } from '@ngneers/controls-themes';

// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({ selector: '[ptInt]' })
export class NgnPt<T extends NgnBaseSafe<Name>, Name extends ControlName> {
  public readonly ptInt = input.required<T>();
  public readonly ptClass =
    input.required<
      AppliedThemeClassCfg<T extends NgnBaseSafe<infer A> ? (A extends null ? never : A) : never>
    >();

  private readonly _engine = new NgnPtEngine(this.ptInt, this.ptClass);
}
