export function getClassName(prefix: string, scope: string, className?: string) {
  let result = `${prefix}${scope}`;
  if (className) result += `-${className}`;
  return result;
}
