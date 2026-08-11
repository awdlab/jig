import assert from 'node:assert/strict';
import { before, test } from 'node:test';

import { generateTypeMatrix } from './type-matrix-gen';

import type { TypeMatrix } from '../../apps/docs/src/app/utils/playground/type-model';

let matrix: TypeMatrix;

before(
  async () => {
    matrix = await generateTypeMatrix();
  },
  { timeout: 300_000 }
);

function combo(control: string, key: string) {
  const entry = matrix[control];
  assert.ok(entry, `${control} missing from the matrix`);
  const inputs = entry.combos[key];
  assert.ok(inputs, `${control} has no combination "${key}" (has: ${Object.keys(entry.combos)})`);
  return inputs;
}

test('binds a boolean type parameter to its input', () => {
  const entry = matrix['JigSelect'];
  assert.deepEqual(
    entry?.params.map(p => [p.name, p.input]),
    [
      ['Editable', 'editable'],
      ['Multiple', 'multiple'],
    ]
  );
});

test('renders a boolean-constrained parameter as a boolean input', () => {
  assert.deepEqual(combo('JigSelect', 'false|false')['multiple'], {
    kind: 'literal',
    value: false,
    optional: true,
  });
});

test('resolves the select value through its conditional type', () => {
  assert.equal(combo('JigSelect', 'false|false')['value']?.kind, 'param');
  assert.deepEqual(combo('JigSelect', 'false|true')['value'], {
    kind: 'array',
    elementType: { kind: 'param', name: 'V' },
    optional: true,
  });
  assert.deepEqual(combo('JigSelect', 'true|false')['value'], {
    kind: 'primitive',
    type: 'string',
    optional: true,
  });
});

test('resolves the slider value to a tuple in range mode', () => {
  assert.deepEqual(combo('JigSlider', 'false')['value'], { kind: 'primitive', type: 'number' });
  assert.deepEqual(combo('JigSlider', 'true')['value'], {
    kind: 'tuple',
    elements: [
      { kind: 'primitive', type: 'number' },
      { kind: 'primitive', type: 'number' },
    ],
  });
});

test('resolves the checkbox value to a nullable boolean when indeterminate', () => {
  assert.deepEqual(combo('JigCheckbox', 'false')['value'], { kind: 'primitive', type: 'boolean' });
  assert.deepEqual(combo('JigCheckbox', 'true')['value'], {
    kind: 'primitive',
    type: 'boolean',
    optional: true,
  });
});

test('omits inputs whose type contains a function', () => {
  assert.equal(combo('JigSlider', 'false')['valueTextFn'], undefined);
});

test('covers non-generic controls under the empty combination', () => {
  assert.deepEqual(combo('JigInput', '')['invalid'], { kind: 'primitive', type: 'boolean' });
});
