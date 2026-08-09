import { Directive, forwardRef } from '@angular/core';
import { NG_ASYNC_VALIDATORS, type AsyncValidator, type ValidationErrors } from '@angular/forms';

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
  validate(): Promise<ValidationErrors> {
    return new Promise(resolve => {
      setTimeout(() => resolve({ server: true }), 100);
    });
  }
}
