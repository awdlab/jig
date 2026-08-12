import type { TypeDeclaration } from './type-model';

function typeName(value: unknown): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

function prefix(path: string, message: string): string {
  return path ? `${path}: ${message}` : message;
}

function join(path: string, property: string): string {
  return `${path}${path ? '.' : ''}${property}`;
}

function describe(type: TypeDeclaration): string {
  switch (type.kind) {
    case 'primitive':
      return type.type;
    case 'array':
      return 'an array';
    case 'tuple':
      return `a tuple of ${type.elements.length} elements`;
    case 'object':
      return 'an object';
    default:
      return 'a value';
  }
}

/** Structurally checks a parsed JSON value against a resolved input type. */
export function validateAgainstType(
  value: unknown,
  type: TypeDeclaration,
  path = ''
): string | null {
  if (value === null || value === undefined) {
    if (type.optional || type.kind === 'unknown' || type.kind === 'param') return null;
    return prefix(path, `expected ${describe(type)}, got ${typeName(value)}`);
  }

  switch (type.kind) {
    case 'unknown':
    case 'param':
      return null;

    case 'primitive': {
      if (type.type === 'date') {
        const valid = typeof value === 'string' && !Number.isNaN(Date.parse(value));
        return valid ? null : prefix(path, `expected an ISO date string, got ${typeName(value)}`);
      }
      return typeof value === type.type
        ? null
        : prefix(path, `expected ${type.type}, got ${typeName(value)}`);
    }

    case 'literal':
      return value === type.value ? null : prefix(path, `expected ${JSON.stringify(type.value)}`);

    case 'literalUnion': {
      if (type.allowCustomValue) return null;
      return type.values.some(v => v.value === value)
        ? null
        : prefix(path, `expected one of: ${type.values.map(v => String(v.value)).join(', ')}`);
    }

    case 'array': {
      if (!Array.isArray(value)) return prefix(path, `expected an array, got ${typeName(value)}`);
      for (const [index, item] of value.entries()) {
        const error = validateAgainstType(item, type.elementType, `${path}[${index}]`);
        if (error) return error;
      }
      return null;
    }

    case 'tuple': {
      if (!Array.isArray(value)) return prefix(path, `expected an array, got ${typeName(value)}`);
      if (value.length !== type.elements.length) {
        return prefix(
          path,
          `expected a tuple of ${type.elements.length} elements, got ${value.length}`
        );
      }
      for (const [index, element] of type.elements.entries()) {
        const error = validateAgainstType(value[index], element, `${path}[${index}]`);
        if (error) return error;
      }
      return null;
    }

    case 'object': {
      if (typeof value !== 'object' || Array.isArray(value)) {
        return prefix(path, `expected an object, got ${typeName(value)}`);
      }
      const record = value as Record<string, unknown>;
      for (const property of type.properties) {
        const present = property.name in record && record[property.name] !== undefined;
        if (!present) {
          if (property.optional) continue;
          return prefix(join(path, property.name), 'required property is missing');
        }
        const error = validateAgainstType(
          record[property.name],
          property.type,
          join(path, property.name)
        );
        if (error) return error;
      }
      const known = new Set(type.properties.map(p => p.name));
      const extra = Object.keys(record).find(key => !known.has(key));
      if (extra) return prefix(join(path, extra), 'unknown property');
      return null;
    }

    case 'union':
      return type.types.some(t => validateAgainstType(value, t, path) === null)
        ? null
        : prefix(path, `no union member matched, got ${typeName(value)}`);
  }
}
