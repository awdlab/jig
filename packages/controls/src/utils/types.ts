export type Prettify<T> = { [K in keyof T]: T[K] } & {};

type SubKey<P, K> = [P] extends [never]
  ? K
  : P extends string
    ? K extends string
      ? `${P}.${K}`
      : K
    : K;
export type DeepPartial<T, Exclude extends string = never, P = never> = T extends object
  ? SubKey<P, '*'> extends Exclude
    ? T
    : Prettify<
        {
          [K in keyof T as SubKey<P, K> extends Exclude ? never : K]?: DeepPartial<
            T[K],
            Exclude,
            SubKey<P, K>
          >;
        } & {
          [K in keyof T as SubKey<P, K> extends Exclude ? K : never]: DeepPartial<
            T[K],
            Exclude,
            SubKey<P, K>
          >;
        }
      >
  : T;

/**
 * Returns all keys of a type T.
 */
export type AllKeysOfUnion<T> = T extends object ? keyof T : never;

export type InputGeneric<T, Default> = symbol extends T ? Default : T;
