import { IconType } from '@ngneers/controls/custom-types';

export type BreadcrumbItem = {
  id: string;
  label: string;
  route?: string | string[];
  callback?: () => void;
};

export type ItemTemplateType = {
  $implicit: BreadcrumbItem;
};

export type SeparatorTemplateType = {
  $implicit: {
    icon: IconType;
  };
};
