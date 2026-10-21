import { makeStateKey, TransferState } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { globalPropertyName } from '@awdlab/jig/utils';
import { beforeEach, describe, expect, it } from 'vitest';

import { JigGlobal } from './globals';

const nextElementIdKey = makeStateKey<number>('jig-next-element-id');

function freshGlobal() {
  delete (window as Partial<Window>)[globalPropertyName];
  TestBed.resetTestingModule();
  return TestBed.configureTestingModule({ providers: [JigGlobal] });
}

describe('JigGlobal element id counter', () => {
  beforeEach(() => freshGlobal());

  it('starts at 1 without transferred state', () => {
    expect(TestBed.inject(JigGlobal).nextElementId).toBe(1);
  });

  it('resumes from the server counter so client ids never repeat server ids', () => {
    TestBed.inject(TransferState).set(nextElementIdKey, 47);
    expect(TestBed.inject(JigGlobal).nextElementId).toBe(47);
  });

  it('publishes the counter for transfer on every increment', () => {
    const global = TestBed.inject(JigGlobal);
    global.nextElementId++;
    global.nextElementId++;
    expect(TestBed.inject(TransferState).get(nextElementIdKey, 0)).toBe(3);
  });
});
