export type FormattedTableRow<T> = {
  id: T[keyof T] & (string | number);
  data: T;
  index: number;
};
