export function getScrollTop(
  elementOffsetTop: number,
  elementHeight: number,
  containerHeight: number,
  currentScrollTop: number,
  behavior: ScrollLogicalPosition
): number {
  switch (behavior) {
    case 'start':
      return elementOffsetTop;
    case 'end':
      return elementOffsetTop - containerHeight + elementHeight;
    case 'center':
      return elementOffsetTop - (containerHeight - elementHeight) / 2;
    case 'nearest': {
      const start = elementOffsetTop;
      const end = elementOffsetTop - containerHeight + elementHeight;
      if (currentScrollTop > end && currentScrollTop < start) {
        return currentScrollTop;
      }
      return Math.abs(start - currentScrollTop) < Math.abs(end - currentScrollTop) ? start : end;
    }
  }
}
