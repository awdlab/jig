import { NgnActionItem, NgnActionItemFlat } from '@ngneers/controls/api';
import { IconType } from '@ngneers/controls/custom-types';

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
