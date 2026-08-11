import { Directive, forwardRef } from '@angular/core';
import { NG_ASYNC_VALIDATORS, type AsyncValidator, type ValidationErrors } from '@angular/forms';

type ResolverWindow = Window & { jigResolveAsyncValidator?: () => void };

/**
 * Stays pending until the test calls `window.jigResolveAsyncValidator()`, so the
 * pending phase can be asserted without racing a timer.
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
      (window as ResolverWindow).jigResolveAsyncValidator = () => resolve({ server: true });
    });
  }
}
