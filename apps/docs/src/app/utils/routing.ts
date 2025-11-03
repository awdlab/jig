export function safeRoutePath(title: string): string {
  return title.toLowerCase().replace(/\s+/g, '-');
}
