import { Directive, input, TemplateRef } from '@angular/core';
import { NgnBase } from '@awdlab/jig/base';

import type { ContentTemplateType, HeaderTemplateType } from './types';

/**
 * Template inputs for {@link NgnSnackbar}, extracted into a dedicated base class so the
 * component itself stays focused on behavior.
 */
@Directive()
export abstract class SnackbarTemplates extends NgnBase<'snackbar'> {
  /** Custom template for the snackbar body, rendered in place of the plain `content` string. */
  public readonly templateContent = input<TemplateRef<ContentTemplateType> | null>();
  /** Custom template for the snackbar header, rendered in place of the plain `header` string. */
  public readonly templateHeader = input<TemplateRef<HeaderTemplateType> | null>();
}
