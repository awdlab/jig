import { FilterConfig, FilterConfigInternal, FilterFn } from '@ngneers/controls/api';

type _SelectFilterOptions = {
  clearFilterOnClose?: boolean;
};
export type SelectFilterOptions<T extends object> = _SelectFilterOptions & FilterConfig<T>;

export type SelectFilterOptionsInternal<T extends object> = _SelectFilterOptions &
  FilterConfigInternal<T>;

export type SelectOption<T = any, K extends keyof T = any> = {
  data?: T;
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

export type SelectFilterFn<T extends object> = FilterFn<SelectOption<T>>;
