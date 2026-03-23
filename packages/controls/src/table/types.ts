export type FormattedTableDataRow<T> = {
  kind: 'data' | 'header' | 'footer';
  id: T[keyof T] & (string | number);
  data: T;
  index: number;
};

export type FormattedTableGroupHeaderRow<V = unknown> = {
  kind: 'group-header';
  id: string;
  groupKey: V;
  groupValue: V;
  count: number;
  expanded: boolean;
  index: number;
};

export type FormattedTableRow<T, V = unknown> =
  | FormattedTableDataRow<T>
  | FormattedTableGroupHeaderRow<V>;
