export function toggleClass(element: HTMLElement, className: string | string[], state: boolean) {
  const classes = Array.isArray(className) ? className : className.split(' ');
  classes.forEach(cls => element.classList.toggle(cls, state));
}
