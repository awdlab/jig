import ts from 'typescript';

import type { TypeDeclaration } from '../../apps/docs/src/app/utils/playground/type-model';

/** Thrown for types the playground cannot represent; the input is then omitted. */
export const DISQUALIFIED = Symbol('disqualified');

const MAX_DEPTH = 4;
const NULLISH = ts.TypeFlags.Undefined | ts.TypeFlags.Null | ts.TypeFlags.Void;

function isPlaceholder(type: ts.Type): string | null {
  const name = type.getSymbol()?.getName();
  return name?.startsWith('__P_') ? name.slice('__P_'.length) : null;
}

/** Serializes a checker type, throwing `DISQUALIFIED` when it cannot be represented. */
export function serializeType(
  type: ts.Type,
  checker: ts.TypeChecker,
  depth = 0,
  seen: Set<ts.Type> = new Set()
): TypeDeclaration {
  const placeholder = isPlaceholder(type);
  if (placeholder) return { kind: 'param', name: placeholder };

  if (type.flags & (ts.TypeFlags.Any | ts.TypeFlags.Unknown)) return { kind: 'unknown' };
  if (type.flags & ts.TypeFlags.String) return { kind: 'primitive', type: 'string' };
  if (type.flags & ts.TypeFlags.Number) return { kind: 'primitive', type: 'number' };
  if (type.flags & ts.TypeFlags.Boolean) return { kind: 'primitive', type: 'boolean' };
  if (type.flags & ts.TypeFlags.BooleanLiteral) {
    return {
      kind: 'literal',
      value: (type as unknown as { intrinsicName: string }).intrinsicName === 'true',
    };
  }
  if (type.isStringLiteral() || type.isNumberLiteral()) {
    return { kind: 'literal', value: type.value };
  }
  if (type.getSymbol()?.getName() === 'Date') return { kind: 'primitive', type: 'date' };

  if (type.isUnion()) {
    const optional = type.types.some(t => t.flags & NULLISH);
    const rest = type.types.filter(t => !(t.flags & NULLISH));

    // A union stores `boolean` as `true | false`; put it back together.
    const isBooleanLiteral = (t: ts.Type) => !!(t.flags & ts.TypeFlags.BooleanLiteral);
    const collapseBoolean = rest.filter(isBooleanLiteral).length === 2;
    const others = collapseBoolean ? rest.filter(t => !isBooleanLiteral(t)) : rest;

    const members: TypeDeclaration[] = [
      ...(collapseBoolean ? [{ kind: 'primitive' as const, type: 'boolean' as const }] : []),
      ...others.map(t => serializeType(t, checker, depth, seen)),
    ];

    if (!members.length) throw DISQUALIFIED;
    if (members.length === 1) {
      return { ...members[0]!, optional };
    }

    const literals = members.filter(m => m.kind === 'literal');
    if (literals.length) {
      const values = literals.map(m => ({ label: String(m.value), value: m.value }));
      return {
        kind: 'literalUnion',
        primitiveType: typeof values[0]?.value,
        allowCustomValue: members.length !== literals.length,
        values,
        optional,
      };
    }
    return { kind: 'union', types: members, optional };
  }

  if (checker.isTupleType(type)) {
    const elements = checker.getTypeArguments(type as ts.TypeReference);
    return { kind: 'tuple', elements: elements.map(e => serializeType(e, checker, depth, seen)) };
  }

  if (checker.isArrayType(type)) {
    const element = checker.getTypeArguments(type as ts.TypeReference)[0];
    if (!element) throw DISQUALIFIED;
    return { kind: 'array', elementType: serializeType(element, checker, depth, seen) };
  }

  if (type.flags & ts.TypeFlags.Object) {
    if (type.getCallSignatures().length || type.getConstructSignatures().length) throw DISQUALIFIED;
    if (seen.has(type)) return { kind: 'unknown' };
    if (depth >= MAX_DEPTH) throw DISQUALIFIED;

    const nested = new Set(seen).add(type);
    const properties = checker.getPropertiesOfType(type).map(symbol => {
      const declaration = symbol.declarations?.[0];
      if (!declaration) throw DISQUALIFIED;
      const propertyType = checker.getTypeOfSymbolAtLocation(symbol, declaration);
      return {
        name: symbol.getName(),
        optional: !!(symbol.flags & ts.SymbolFlags.Optional),
        type: serializeType(propertyType, checker, depth + 1, nested),
      };
    });
    if (!properties.length) throw DISQUALIFIED;
    return { kind: 'object', properties };
  }

  throw DISQUALIFIED;
}
