import type { Middleware, Placement } from '@floating-ui/dom';

export type RelativeAnchorElementPositionData = {
  start: number;
  center: number;
  end: number;
};

export const relativeAnchorElementPosition: Middleware = {
  name: 'relativeAnchorElementPosition',
  async fn(state) {
    const { placement, rects } = state;

    const axis = getAxis(placement);
    const axisSize = axis === 'x' ? 'width' : 'height';

    return {
      data: {
        start: rects.reference[axis] - state[axis],
        center: rects.reference[axis] + rects.reference[axisSize] / 2 - state[axis],
        end: rects.reference[axis] + rects.reference[axisSize] - state[axis],
      } satisfies RelativeAnchorElementPositionData,
    };
  },
};

function getAxis(placement: Placement): 'x' | 'y' {
  switch (placement.split('-')[0]) {
    case 'top':
    case 'bottom':
      return 'x';
    case 'left':
    case 'right':
      return 'y';
    default:
      throw new Error(`Unknown placement: ${placement}`);
  }
}
