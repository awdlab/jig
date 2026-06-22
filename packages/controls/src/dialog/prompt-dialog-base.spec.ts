import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { assertType, beforeEach, describe, expect, it, vi } from 'vitest';

import { PromptDialogBase } from './prompt-dialog-base';

import type { createDialog, DialogHandle, PromptDialogHandle } from './create-dialog';
import type { DialogConfig } from './types';
import type { NgnActionButtonConfig } from '@ngneers/controls/api';

// --- Test components ---

@Component({
  selector: 'test-prompt',
  template: '',
})
class TestPrompt extends PromptDialogBase<{ name: string }, 'ok' | 'cancel'> {
  protected override onDialogButtonClicked(button: 'ok' | 'cancel'): void {
    if (button === 'ok') {
      this.fulfilPrompt({ name: 'test' });
    } else {
      this.fulfilPrompt();
    }
  }
}

@Component({
  selector: 'test-boolean-prompt',
  template: '',
})
class BooleanPrompt extends PromptDialogBase<{ value: string }, true | false> {
  protected override onDialogButtonClicked(button: true | false): void {
    if (button) {
      this.fulfilPrompt({ value: 'hello' });
    } else {
      this.fulfilPrompt();
    }
  }
}

@Component({
  selector: 'test-non-prompt',
  template: '',
})
class NonPromptComponent {
  public readonly someInput = input<string>();
}

// --- Tests ---

describe('PromptDialogBase', () => {
  let fixture: ComponentFixture<TestPrompt>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(TestPrompt);
  });

  describe('fulfilPrompt', () => {
    it('should call resolve fn with data when fulfilPrompt is called with data', () => {
      const resolveFn = vi.fn();

      fixture.componentRef.setInput('ngnPromptDialogResolveFn', {
        fn: resolveFn,
        button: 'ok',
      });
      TestBed.tick();

      expect(resolveFn).toHaveBeenCalledWith({ name: 'test' });
    });

    it('should call resolve fn with null when fulfilPrompt is called without data', () => {
      const resolveFn = vi.fn();

      fixture.componentRef.setInput('ngnPromptDialogResolveFn', {
        fn: resolveFn,
        button: 'cancel',
      });
      TestBed.tick();

      expect(resolveFn).toHaveBeenCalledWith(null);
    });
  });

  describe('onDialogButtonClicked', () => {
    it('should be called with the correct button value', () => {
      const spy = vi.spyOn(fixture.componentInstance as any, 'onDialogButtonClicked');
      const resolveFn = vi.fn();

      fixture.componentRef.setInput('ngnPromptDialogResolveFn', {
        fn: resolveFn,
        button: 'ok',
      });
      TestBed.tick();

      expect(spy).toHaveBeenCalledWith('ok');

      fixture.componentRef.setInput('ngnPromptDialogResolveFn', {
        fn: resolveFn,
        button: 'cancel',
      });
      TestBed.tick();

      expect(spy).toHaveBeenCalledWith('cancel');
    });
  });
});

describe('PromptDialogBase type safety', () => {
  it('should accept matching button values in PromptDialogBase subclass', () => {
    assertType<PromptDialogBase<{ name: string }, 'ok' | 'cancel'>>({} as TestPrompt);
    assertType<PromptDialogBase<{ value: string }, true | false>>({} as BooleanPrompt);
  });

  it('should accept valid DialogConfig with matching button values for PromptDialogBase content', () => {
    assertType<
      DialogConfig<TestPrompt, [NgnActionButtonConfig<'ok'>, NgnActionButtonConfig<'cancel'>]>
    >({
      title: 'Test',
      content: TestPrompt,
      footerButtons: [
        { label: 'OK', value: 'ok' },
        { label: 'Cancel', value: 'cancel' },
      ],
    });
  });

  it('should accept valid DialogConfig with boolean button values', () => {
    assertType<
      DialogConfig<BooleanPrompt, [NgnActionButtonConfig<true>, NgnActionButtonConfig<false>]>
    >({
      title: 'Prompt',
      content: BooleanPrompt,
      footerButtons: [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ],
    });
  });

  it('should have type error for mismatched button values in footer buttons', () => {
    // Button values 'yes' | 'no' don't match PromptDialogBase<_, 'ok' | 'cancel'>
    assertType<
      DialogConfig<
        TestPrompt,
        // @ts-expect-error 'yes' is not assignable to 'ok' | 'cancel'
        [NgnActionButtonConfig<'yes'>, NgnActionButtonConfig<'no'>]
      >
    >({
      title: 'Test',
      content: TestPrompt,
      footerButtons: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
      ],
    });
  });

  it('should have type error for partially mismatched button values', () => {
    assertType<
      DialogConfig<
        TestPrompt,
        // @ts-expect-error 'nope' is not assignable to 'ok' | 'cancel'
        [NgnActionButtonConfig<'ok'>, NgnActionButtonConfig<'nope'>]
      >
    >({
      title: 'Test',
      content: TestPrompt,
      footerButtons: [
        { label: 'OK', value: 'ok' },
        { label: 'Nope', value: 'nope' },
      ],
    });
  });

  it('should have type error for wrong type of button values in boolean prompt', () => {
    assertType<
      DialogConfig<
        BooleanPrompt,
        // @ts-expect-error string is not assignable to true | false
        [NgnActionButtonConfig<'confirm'>, NgnActionButtonConfig<'cancel'>]
      >
    >({
      title: 'Test',
      content: BooleanPrompt,
      footerButtons: [
        { label: 'Confirm', value: 'confirm' },
        { label: 'Cancel', value: 'cancel' },
      ],
    });
  });

  it('should return PromptDialogHandle for PromptDialogBase content', () => {
    assertType<
      PromptDialogHandle<TestPrompt, [NgnActionButtonConfig<'ok'>, NgnActionButtonConfig<'cancel'>]>
    >(
      {} as ReturnType<
        typeof createDialog<
          TestPrompt,
          [NgnActionButtonConfig<'ok'>, NgnActionButtonConfig<'cancel'>]
        >
      >
    );
  });

  it('should return DialogHandle for non-prompt content', () => {
    assertType<DialogHandle<NonPromptComponent, [NgnActionButtonConfig<unknown>]>>(
      {} as ReturnType<typeof createDialog<NonPromptComponent, [NgnActionButtonConfig<unknown>]>>
    );
  });
});
