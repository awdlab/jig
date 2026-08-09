export type TemplateVariable<T> = T | { readonly [subKey: string]: TemplateVariable<T> };
