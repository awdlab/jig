import type { ParamBinding, TypeDeclaration } from './type-model';

/** Joins the live values of the parameter-bound inputs into a combination key. */
export function comboKey(params: ParamBinding[], read: (input: string) => unknown): string {
  return params
    .map(param => {
      if (!param.input) return param.default;
      const value = read(param.input);
      return value === undefined || value === null ? param.default : !!value;
    })
    .join('|');
}

interface ItemLike {
  label?: unknown;
  value?: unknown;
  items?: unknown;
}

function isItemLike(value: unknown): value is ItemLike {
  return typeof value === 'object' && value !== null && ('value' in value || 'items' in value);
}

/** Harvests selectable values out of the instance's item arrays. */
export function collectParamValues(values: unknown[]): { label: string; value: unknown }[] {
  const collected: { label: string; value: unknown }[] = [];
  const seen = new Set<unknown>();

  function visit(candidate: unknown): void {
    if (Array.isArray(candidate)) {
      candidate.forEach(visit);
      return;
    }
    if (!isItemLike(candidate)) return;
    if (Array.isArray(candidate.items)) {
      candidate.items.forEach(visit);
      return;
    }
    if (candidate.value === undefined || seen.has(candidate.value)) return;
    seen.add(candidate.value);
    collected.push({
      label: String(candidate.label ?? candidate.value),
      value: candidate.value,
    });
  }

  values.forEach(visit);
  return collected;
}

/** Substitutes `param` leaves with a literal union; returns null if none can be filled. */
export function resolveParams(
  type: TypeDeclaration,
  values: { label: string; value: unknown }[]
): TypeDeclaration | null {
  switch (type.kind) {
    case 'param': {
      if (!values.length) return null;
      return {
        kind: 'literalUnion',
        primitiveType: typeof values[0]?.value,
        allowCustomValue: false,
        values,
        ...(type.optional === undefined ? {} : { optional: type.optional }),
      };
    }
    case 'array': {
      const elementType = resolveParams(type.elementType, values);
      return elementType ? { ...type, elementType } : null;
    }
    case 'tuple': {
      const elements = type.elements.map(element => resolveParams(element, values));
      return elements.every(element => element !== null)
        ? { ...type, elements: elements as TypeDeclaration[] }
        : null;
    }
    case 'union': {
      const types = type.types.map(member => resolveParams(member, values));
      return types.every(member => member !== null)
        ? { ...type, types: types as TypeDeclaration[] }
        : null;
    }
    case 'object': {
      const properties = type.properties.map(property => ({
        ...property,
        type: resolveParams(property.type, values),
      }));
      return properties.every(property => property.type !== null)
        ? ({ ...type, properties } as TypeDeclaration)
        : null;
    }
    default:
      return type;
  }
}
