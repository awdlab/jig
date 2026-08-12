import { Directive, forwardRef } from '@angular/core';
import { NG_ASYNC_VALIDATORS, type AsyncValidator, type ValidationErrors } from '@angular/forms';

type ResolverWindow = Window & { jigResolveAsyncValidator?: () => void };

/**
 * Stays pending until the test calls `window.jigResolveAsyncValidator()`, so the
 * pending phase can be asserted without racing a timer. Settles on its own after
 * 10s, so a test that forgets to resolve fails on its assertion rather than hanging.
 */
@Directive({
  selector: '[jigTestAsyncValidator]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: forwardRef(() => TestAsyncValidator),
      multi: true,
    },
  ],
})
export class TestAsyncValidator implements AsyncValidator {
  public validate(): Promise<ValidationErrors> {
    return new Promise(resolve => {
      const settle = (): void => resolve({ server: true });
      (window as ResolverWindow).jigResolveAsyncValidator = settle;
      setTimeout(settle, 10_000);
    });
  }
}
