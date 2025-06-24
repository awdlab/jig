export type DeepKeys<T, P extends string = ''> = T extends object
  ? {
      [K in keyof T]-?: K extends string
        ? T[K] extends object
          ? DeepKeys<T[K], `${P}${K}.`>
          : `${P}${K}`
        : never;
    }[keyof T]
  : P;
