export function getClassName(
  prefix: string,
  scope: string,
  className?: string,
  unstyled?: boolean
): string {
  let result = `${prefix}${scope}`;
  if (className) result += `-${className}`;
  if (unstyled) result += ` ngn-unstyled`;
  return result;
}
