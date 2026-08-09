import { Directive, input, TemplateRef } from '@angular/core';
import { NgnBase } from '@awdlab/jig/base';

import type { ContentTemplateType, HeaderTemplateType } from './types';

/**
 * Template inputs for {@link NgnToast}, extracted into a dedicated base class so the
 * component itself stays focused on behavior.
 */
@Directive()
export abstract class ToastTemplates extends NgnBase<'toast'> {
  /** Custom template for the toast body, rendered in place of the plain `content` string. */
  public readonly templateContent = input<TemplateRef<ContentTemplateType> | null>();
  /** Custom template for the toast header, rendered in place of the plain `header` string. */
  public readonly templateHeader = input<TemplateRef<HeaderTemplateType> | null>();
}
