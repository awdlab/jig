import { TemplateRef } from '@angular/core';

import type { AwdActionButtonConfig } from '@awdlab/jig/api';
import type { CustomColor, IconType } from '@awdlab/jig-custom-types';

export type HeaderTemplateType = {
  header?: string;
  closable: boolean;
  closeSnackbar: () => void;
};

export type ContentTemplateType = {
  content?: string;
};

export type AwdSnackbarOptionsMeta = {
  closable?: boolean;
  color?: CustomColor;
  icon?: IconType;
  autoHide?: number | false;
  actions?: AwdActionButtonConfig[];
  showProgress?: boolean;
  pauseOnHover?: boolean;
  ariaLive?: 'polite' | 'assertive' | 'off';
};

export type AwdSnackbarOptions = AwdSnackbarOptionsMeta & {
  header?: string;
  content?: string;
  headerTemplate?: TemplateRef<HeaderTemplateType>;
  contentTemplate?: TemplateRef<ContentTemplateType>;
};

export type AwdSnackbarRef = {
  hide: () => void;
};
