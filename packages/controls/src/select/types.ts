import { FilterConfig, FilterConfigInternal, FilterFn, NgnItem } from '@ngneers/controls/api';

type _SelectFilterOptions = {
  clearFilterOnClose?: boolean;
};
export type SelectFilterOptions<T extends object> = _SelectFilterOptions & FilterConfig<T>;

export type SelectFilterOptionsInternal<T extends object> = _SelectFilterOptions &
  FilterConfigInternal<T>;

export type SelectFilterFn<T extends object> = FilterFn<NgnItem<T>>;
