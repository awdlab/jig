import type { JigActionItem, JigActionItemFlat } from '@awdlab/jig/api';
import type { IconType } from '@awdlab/jig-custom-types';

export type BreadcrumbItem = JigActionItemFlat<JigActionItem>;

export type ItemTemplateType = {
  $implicit: BreadcrumbItem;
};

export type SeparatorTemplateType = {
  $implicit: {
    icon: IconType;
  };
};

export type OverflowTemplateType = {
  $implicit: {
    icon: IconType;
    overflowingItems: BreadcrumbItem[];
  };
};
