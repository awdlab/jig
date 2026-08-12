/** A control input's type, resolved by the TypeScript checker at build time. */
export type TypeDeclaration = (
  | { kind: 'primitive'; type: 'string' | 'number' | 'boolean' | 'date' }
  | { kind: 'literal'; value: string | number | boolean }
  | {
      kind: 'literalUnion';
      primitiveType: string;
      allowCustomValue: boolean;
      values: { label: string; value: unknown }[];
    }
  | { kind: 'array'; elementType: TypeDeclaration }
  | { kind: 'tuple'; elements: TypeDeclaration[] }
  | { kind: 'object'; properties: { name: string; optional: boolean; type: TypeDeclaration }[] }
  | { kind: 'union'; types: TypeDeclaration[] }
  | { kind: 'param'; name: string }
  | { kind: 'unknown' }
) & {
  optional?: boolean;
};

/** A generic parameter and the input whose live value selects its value. */
export interface ParamBinding {
  name: string;
  /** Property name on the component instance, or null when no input binds it. */
  input: string | null;
  default: boolean;
}

export interface ControlTypes {
  params: ParamBinding[];
  /** Input name → the class that declares it, used to group the playground panel. */
  owners: Record<string, string>;
  /** Combination key (param values joined by `|`) → input name → resolved type. */
  combos: Record<string, Record<string, TypeDeclaration>>;
}

/** Class name (`JigSelect`) → its resolved input types. */
export type TypeMatrix = Record<string, ControlTypes>;
