import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  collectParamValues,
  comboKey,
  resolveParams,
} from '../../apps/docs/src/app/utils/playground/params';

import type {
  ParamBinding,
  TypeDeclaration,
} from '../../apps/docs/src/app/utils/playground/type-model';

const params: ParamBinding[] = [
  { name: 'Editable', input: 'editable', default: false },
  { name: 'Multiple', input: 'multiple', default: false },
];

test('builds a key from the live input values', () => {
  assert.equal(
    comboKey(params, name => name === 'multiple'),
    'false|true'
  );
});

test('falls back to the declared default when the input is unset', () => {
  assert.equal(
    comboKey(params, () => undefined),
    'false|false'
  );
});

test('pins an unbound parameter to its default', () => {
  assert.equal(
    comboKey([{ name: 'Multiple', input: null, default: false }], () => true),
    'false'
  );
});

test('collects values from item arrays, recursing into groups', () => {
  const options = [
    { label: 'One', value: '1' },
    { label: 'Group', items: [{ label: 'Two', value: '2' }] },
  ];
  assert.deepEqual(collectParamValues([options, 'not an array', 42]), [
    { label: 'One', value: '1' },
    { label: 'Two', value: '2' },
  ]);
});

test('deduplicates by value and falls back to the value as the label', () => {
  assert.deepEqual(collectParamValues([[{ value: 'a' }, { value: 'a' }]]), [
    { label: 'a', value: 'a' },
  ]);
});

test('replaces a param leaf with a literal union', () => {
  const values = [{ label: 'One', value: '1' }];
  assert.deepEqual(resolveParams({ kind: 'param', name: 'V' }, values), {
    kind: 'literalUnion',
    primitiveType: 'string',
    allowCustomValue: false,
    values,
  });
});

test('replaces a param nested in an array and preserves optional', () => {
  const values = [{ label: 'One', value: '1' }];
  const type: TypeDeclaration = {
    kind: 'array',
    elementType: { kind: 'param', name: 'V' },
    optional: true,
  };
  assert.deepEqual(resolveParams(type, values), {
    kind: 'array',
    elementType: {
      kind: 'literalUnion',
      primitiveType: 'string',
      allowCustomValue: false,
      values,
    },
    optional: true,
  });
});

test('returns null when a param cannot be filled', () => {
  assert.equal(resolveParams({ kind: 'param', name: 'V' }, []), null);
  assert.equal(
    resolveParams({ kind: 'array', elementType: { kind: 'param', name: 'V' } }, []),
    null
  );
});

test('leaves param-free types untouched', () => {
  const type: TypeDeclaration = { kind: 'primitive', type: 'number' };
  assert.deepEqual(resolveParams(type, []), type);
});
