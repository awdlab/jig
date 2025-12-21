export type FormattedTableRow<T> = {
  kind: 'data' | 'header' | 'footer';
  id: T[keyof T] & (string | number);
  data: T;
  index: number;
};
