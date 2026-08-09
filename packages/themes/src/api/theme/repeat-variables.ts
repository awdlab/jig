import type { TemplateVariable } from './template-variable';
import { deepSet } from '../utils/deep-set';
import type { UnionToIntersection } from '../utils/union-to-intersection';

type RepeatVariables<K extends string, T> = UnionToIntersection<
  K extends `${infer P}.${infer R}`
    ? { [Q in P]: RepeatVariables<R, T> }
    : K extends ''
      ? T
      : { [P in K]: T }
>;

export function repeatVariables<
  const TVariations extends readonly string[],
  TVariables extends Record<string, TemplateVariable<null>>,
>(
  variations: TVariations,
  variables: TVariables
): RepeatVariables<TVariations[number], TVariables> {
  return variations.reduce(
    (acc, variation) => {
      deepSet(acc, variation, variables);
      return acc;
    },
    {} as RepeatVariables<TVariations[number], TVariables>
  );
}
