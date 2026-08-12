import assert from 'node:assert/strict';
import { test } from 'node:test';

import { validateAgainstType } from '../../apps/docs/src/app/utils/playground/validate';

import type { TypeDeclaration } from '../../apps/docs/src/app/utils/playground/type-model';

const num: TypeDeclaration = { kind: 'primitive', type: 'number' };
const str: TypeDeclaration = { kind: 'primitive', type: 'string' };

test('accepts a matching primitive', () => {
  assert.equal(validateAgainstType(3, num), null);
});

test('rejects a mismatched primitive', () => {
  assert.equal(validateAgainstType('3', num), 'expected number, got string');
});

test('accepts null only when optional', () => {
  assert.equal(validateAgainstType(null, num), 'expected number, got null');
  assert.equal(validateAgainstType(null, { ...num, optional: true }), null);
});

test('checks tuple length and elements', () => {
  const tuple: TypeDeclaration = { kind: 'tuple', elements: [num, num] };
  assert.equal(validateAgainstType([1, 2], tuple), null);
  assert.equal(validateAgainstType([1], tuple), 'expected a tuple of 2 elements, got 1');
  assert.equal(validateAgainstType([1, 'x'], tuple), '[1]: expected number, got string');
});

test('checks array elements and reports the index', () => {
  const arr: TypeDeclaration = { kind: 'array', elementType: str };
  assert.equal(validateAgainstType(['a', 'b'], arr), null);
  assert.equal(validateAgainstType(['a', 2], arr), '[1]: expected string, got number');
  assert.equal(validateAgainstType('a', arr), 'expected an array, got string');
});

test('checks object properties, missing and unknown', () => {
  const obj: TypeDeclaration = {
    kind: 'object',
    properties: [
      { name: 'width', optional: false, type: num },
      { name: 'label', optional: true, type: str },
    ],
  };
  assert.equal(validateAgainstType({ width: 1 }, obj), null);
  assert.equal(validateAgainstType({ width: 1, label: 'a' }, obj), null);
  assert.equal(validateAgainstType({}, obj), 'width: required property is missing');
  assert.equal(validateAgainstType({ width: 1, nope: 1 }, obj), 'nope: unknown property');
  assert.equal(validateAgainstType({ width: 'a' }, obj), 'width: expected number, got string');
});

test('accepts a value matching any union member', () => {
  const union: TypeDeclaration = { kind: 'union', types: [num, str] };
  assert.equal(validateAgainstType('a', union), null);
  assert.equal(validateAgainstType(true, union), 'no union member matched, got boolean');
});

test('checks literal unions against their values', () => {
  const lit: TypeDeclaration = {
    kind: 'literalUnion',
    primitiveType: 'string',
    allowCustomValue: false,
    values: [{ label: 'a', value: 'a' }],
  };
  assert.equal(validateAgainstType('a', lit), null);
  assert.equal(validateAgainstType('b', lit), 'expected one of: a');
});

test('accepts anything for unknown and param leaves', () => {
  assert.equal(validateAgainstType({ any: 'thing' }, { kind: 'unknown' }), null);
  assert.equal(validateAgainstType(7, { kind: 'param', name: 'V' }), null);
});

test('nests the path through arrays and objects', () => {
  const type: TypeDeclaration = {
    kind: 'array',
    elementType: {
      kind: 'object',
      properties: [{ name: 'label', optional: false, type: str }],
    },
  };
  assert.equal(validateAgainstType([{ label: 1 }], type), '[0].label: expected string, got number');
});
