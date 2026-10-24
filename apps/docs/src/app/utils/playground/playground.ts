import { Component, input, signal } from '@angular/core';
import type { InputSignalWithTransform, ModelSignal, Signal } from '@angular/core';

import { JigDocsPlaygroundInputs } from './inputs/inputs';
import { JigDocsPlaygroundTokens } from './tokens/tokens';

import type { AnyJigBase } from '@awdlab/jig/base';

export interface PlaygroundControl {
  component: AnyJigBase | readonly AnyJigBase[] | undefined;
  componentName: string;
}

/** The input values of a control, typed from its `input()` and `model()` signals. */
type InputValues<C> = C extends readonly (infer I)[]
  ? InputValues<I>
  : {
      [
        K in keyof C as C[K] extends InputSignalWithTransform<any, any> | ModelSignal<any>
          ? K
          : never
      ]?: C[K] extends InputSignalWithTransform<infer V, any> | ModelSignal<infer V> ? V : never;
    };

export type PlaygroundValues<T extends readonly PlaygroundControl[]> = {
  [C in T[number] as C['componentName']]?: InputValues<NonNullable<C['component']>>;
};

@Component({
  selector: 'jig-docs-playground',
  templateUrl: 'playground.html',
  styleUrl: 'playground.scss',
  imports: [JigDocsPlaygroundTokens, JigDocsPlaygroundInputs],
  // The docs shell is body-scrolled and the tab content is wrapped in inline
  // elements, so an `h-full` chain collapses (invisible) — the playground needs an
  // explicit height. It fills the viewport minus the chrome above it (topbar +
  // title + tabs header; more on mobile where the breadcrumb shows) so the page
  // itself never scrolls — overflow lives in the panels' internal scrollers.
  host: {
    class: 'h-[calc(100dvh_-_16rem)] py-2 pe-2 md:h-[calc(100dvh_-_13.5rem)] md:py-8 md:pe-8 flex',
  },
})
export class JigDocsPlayground<const T extends readonly PlaygroundControl[]> {
  private readonly _values = signal<Record<string, Record<string, unknown>>>({});

  public readonly controls = input.required<T>();

  /** The values set in the inputs panel, keyed by component name and then input name. */
  public readonly values = this._values.asReadonly() as Signal<PlaygroundValues<T>>;

  public setValue(componentName: string, name: string, value: unknown): void {
    this._values.update(values => ({
      ...values,
      [componentName]: { ...values[componentName], [name]: value },
    }));
  }
}
