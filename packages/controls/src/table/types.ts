import { AllKeysOfUnion } from '@ngneers/controls/utils';

export type FormattedTableRow<T> = {
  kind: 'data' | 'header' | 'footer';
  id: T[keyof T] & (string | number);
  data: T;
  index: number;
};

export type TableHeader<T> = { [K in Extract<AllKeysOfUnion<T>, string>]: K };
