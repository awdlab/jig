import { FilterConfig } from '@ngneers/controls/api';

export type SelectFilterOptions<Option extends object> = {
  clearFilterOnClose?: boolean;
} & FilterConfig<Option>;

export type SelectOption<T = any, K extends keyof T = any> = {
  data: T;
  label: string;
  value: T[K];
  testId?: string;
  items?: SelectOption<T, K>[];
};

export type SelectOptionFields<T, K extends keyof T> = {
  label: keyof T;
  value: K;
  testId?: keyof T;
  groupItems?: keyof T;
};
