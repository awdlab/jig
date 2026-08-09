import type { NgnActionItem, NgnActionItemFlat } from '@awdlab/jig/api';
import type { IconType } from '@awdlab/jig-custom-types';

export type BreadcrumbItem = NgnActionItemFlat<NgnActionItem>;

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
