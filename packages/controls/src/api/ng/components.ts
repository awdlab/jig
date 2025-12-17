import { ComponentRef, InputSignal, InputSignalWithTransform } from '@angular/core';

type ComponentFromRef<T extends ComponentRef<any>> = T extends ComponentRef<infer C> ? C : never;
type InputsFromComponent<T> = {
  [K in keyof T]: T[K] extends InputSignal<infer V>
    ? V
    : T[K] extends InputSignalWithTransform<infer V, infer _>
      ? V
      : never;
};

export function setComponentInput<
  T extends ComponentRef<C>,
  C,
  Input extends InputsFromComponent<ComponentFromRef<T>>,
  I extends keyof Input & string,
>(componentRef: T, inputName: I, value: Input[I]): void {
  componentRef.setInput(inputName, value);
}
