import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { ResizeEngine } from './resize-engine';

import type { ResizableItem, ResizeDistributionMode, ResizeSize } from './types';

function createItem(size: string, minSize = '0px', maxSize = '100%'): ResizableItem {
  return {
    size: signal(size as ResizeSize),
    minSize: signal(minSize as any),
    maxSize: signal(maxSize as any),
  } as unknown as ResizableItem;
}

function createEngine(
  items: ResizableItem[],
  containerSize = 1000,
  gapSizes: number[] = [],
  distributionMode: ResizeDistributionMode = 'adjacent',
  containerConstrained = true,
  opts?: { lockSizes?: boolean; minItemSizePx?: number }
): ResizeEngine {
  return new ResizeEngine({
    items: signal(items),
    containerSize: signal(containerSize),
    gapSizes: signal(gapSizes),
    distributionMode: signal(distributionMode),
    containerConstrained: signal(containerConstrained),
    ...(opts?.lockSizes !== undefined ? { lockSizes: signal(opts.lockSizes) } : {}),
    ...(opts?.minItemSizePx !== undefined ? { minItemSizePx: opts.minItemSizePx } : {}),
  });
}

describe('ResizeEngine', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  describe('Grid Template Sizes', () => {
    it('should generate correct template for items without gaps (constrained resolves fr to px)', () => {
      const item1 = createItem('200px');
      const item2 = createItem('1fr');

      TestBed.runInInjectionContext(() => {
        // containerSize=1000, constrained=true → fr resolved to px
        const engine = createEngine([item1, item2]);
        expect(engine.gridTemplateSizes()).toEqual('200px 800px');
      });
    });

    it('should generate correct template with gaps (constrained resolves fr to px)', () => {
      const item1 = createItem('200px');
      const item2 = createItem('1fr');

      TestBed.runInInjectionContext(() => {
        // containerSize=1000, gap=10 → frArea = 1000-200-10 = 790
        const engine = createEngine([item1, item2], 1000, [10]);
        expect(engine.gridTemplateSizes()).toEqual('200px 10px 790px');
      });
    });

    it('should resolve % to px when constrained', () => {
      const item1 = createItem('30%');
      const item2 = createItem('1fr');

      TestBed.runInInjectionContext(() => {
        // 30% of 1000 = 300px, frArea = 700px
        const engine = createEngine([item1, item2]);
        expect(engine.gridTemplateSizes()).toEqual('300px 700px');
      });
    });

    it('should resolve mixed units to px when constrained', () => {
      const item1 = createItem('100px');
      const item2 = createItem('2fr');
      const item3 = createItem('25%');

      TestBed.runInInjectionContext(() => {
        // frArea = 1000 - 100 - 4 - 4 - 250 = 642, totalFr=2, pxPerFr=321
        const engine = createEngine([item1, item2, item3], 1000, [4, 4]);
        expect(engine.gridTemplateSizes()).toEqual('100px 4px 642px 4px 250px');
      });
    });

    it('should return "none" for empty items', () => {
      TestBed.runInInjectionContext(() => {
        const engine = createEngine([]);
        expect(engine.gridTemplateSizes()).toEqual('none');
      });
    });

    it('should resolve single fr item to px when constrained', () => {
      TestBed.runInInjectionContext(() => {
        const engine = createEngine([createItem('1fr')]);
        expect(engine.gridTemplateSizes()).toEqual('1000px');
      });
    });

    it('should keep original units when NOT constrained and no drag has occurred', () => {
      const item1 = createItem('100px');
      const item2 = createItem('2fr');
      const item3 = createItem('25%');

      TestBed.runInInjectionContext(() => {
        // Before any drag, push mode preserves original units to avoid rounding overflow
        const engine = createEngine([item1, item2, item3], 1000, [4, 4], 'adjacent', false);
        expect(engine.gridTemplateSizes()).toEqual('100px 4px 2fr 4px 25%');
      });
    });

    it('should resolve to px when NOT constrained AFTER a drag (push mode needs absolute widths)', () => {
      const item1 = createItem('100px', '50px');
      const item2 = createItem('2fr');
      const item3 = createItem('25%');

      TestBed.runInInjectionContext(() => {
        const engine = createEngine([item1, item2, item3], 1000, [4, 4], 'adjacent', false);
        engine.setItemSize(item1, '100px');
        engine.setItemSize(item2, '642px');
        engine.setItemSize(item3, '250px');
        // Perform a drag to trigger _hasBeenResized
        engine.startDrag(0, 100);
        engine.drag(0, 150);
        engine.endDrag(0, false);
        // After drag, sizes are resolved to px
        expect(engine.gridTemplateSizes()).toMatch(
          /^\d+(\.\d+)?px 4px \d+(\.\d+)?px 4px \d+(\.\d+)?px$/
        );
      });
    });
  });

  describe('Adjacent Mode - Drag', () => {
    it('should resize adjacent items on drag', () => {
      const item1 = createItem('400px', '100px', '500px');
      const item2 = createItem('400px', '100px', '500px');

      TestBed.runInInjectionContext(() => {
        const engine = createEngine([item1, item2], 1000, [10]);
        engine.setItemSize(item1, '400px');
        engine.setItemSize(item2, '400px');

        engine.startDrag(0, 400);
        engine.drag(0, 450);

        expect(parseFloat(item1.size())).toBeCloseTo(450, 0);
        expect(parseFloat(item2.size())).toBeCloseTo(350, 0);
      });
    });

    it('should respect min constraints', () => {
      const item1 = createItem('400px', '100px', '500px');
      const item2 = createItem('400px', '300px', '500px');

      TestBed.runInInjectionContext(() => {
        const engine = createEngine([item1, item2], 1000, [10]);
        engine.setItemSize(item1, '400px');
        engine.setItemSize(item2, '400px');

        engine.startDrag(0, 400);
        engine.drag(0, 600); // Try to push item2 below min

        expect(parseFloat(item2.size())).toBeGreaterThanOrEqual(300);
      });
    });

    it('should respect max constraints', () => {
      const item1 = createItem('400px', '100px', '500px');
      const item2 = createItem('400px', '100px', '500px');

      TestBed.runInInjectionContext(() => {
        const engine = createEngine([item1, item2], 1000, [10]);
        engine.setItemSize(item1, '400px');
        engine.setItemSize(item2, '400px');

        engine.startDrag(0, 400);
        engine.drag(0, 600); // Try to push item1 above max

        expect(parseFloat(item1.size())).toBeLessThanOrEqual(500);
      });
    });

    it('should cancel drag and restore sizes', () => {
      const item1 = createItem('400px', '100px', '500px');
      const item2 = createItem('400px', '100px', '500px');

      TestBed.runInInjectionContext(() => {
        const engine = createEngine([item1, item2], 1000, [10]);
        engine.setItemSize(item1, '400px');
        engine.setItemSize(item2, '400px');

        engine.startDrag(0, 400);
        engine.drag(0, 450);

        // Sizes changed
        expect(item1.size()).not.toBe('400px');

        engine.endDrag(0, true); // cancel

        expect(item1.size()).toEqual('400px');
        expect(item2.size()).toEqual('400px');
      });
    });

    it('should handle fr units correctly', () => {
      const item1 = createItem('1fr', '100px', '500px');
      const item2 = createItem('1fr', '100px', '500px');

      TestBed.runInInjectionContext(() => {
        const engine = createEngine([item1, item2], 1000, [10]);
        engine.setItemSize(item1, '1fr');
        engine.setItemSize(item2, '1fr');

        engine.startDrag(0, 500);
        engine.drag(0, 550);
        engine.endDrag(0, false);

        // Both should still be in 'fr' units (preserve mode)
        expect(item1.size()).toMatch(/fr$/);
        expect(item2.size()).toMatch(/fr$/);
      });
    });

    it('should handle % units correctly', () => {
      const item1 = createItem('30%', '10%', '50%');
      const item2 = createItem('70%', '10%', '90%');

      TestBed.runInInjectionContext(() => {
        const engine = createEngine([item1, item2], 1000);
        engine.setItemSize(item1, '30%');
        engine.setItemSize(item2, '70%');

        engine.startDrag(0, 300);
        engine.drag(0, 350);
        engine.endDrag(0, false);

        // Both should still be in '%' units
        expect(item1.size()).toMatch(/%$/);
        expect(item2.size()).toMatch(/%$/);
      });
    });
  });

  describe('Proportional Mode', () => {
    it('should only change the resized item, leaving others untouched', () => {
      const item1 = createItem('200px', '0px', '1000px');
      const item2 = createItem('300px', '0px', '1000px');
      const item3 = createItem('500px', '0px', '1000px');

      TestBed.runInInjectionContext(() => {
        const engine = createEngine([item1, item2, item3], 1000, [], 'proportional');
        engine.setItemSize(item1, '200px');
        engine.setItemSize(item2, '300px');
        engine.setItemSize(item3, '500px');

        engine.startDrag(0, 200);
        engine.drag(0, 300); // +100px to item1

        // item1 should grow by 100px (locked to absolute px)
        expect(parseFloat(item1.size())).toBeCloseTo(300, 0);

        // Other items stay untouched — CSS grid redistribution handles the rest
        expect(item2.size()).toBe('300px');
        expect(item3.size()).toBe('500px');
      });
    });
  });

  describe('Push Mode', () => {
    it('should grow the resized item without affecting others', () => {
      const item1 = createItem('200px', '0px', '1000px');
      const item2 = createItem('300px', '0px', '1000px');
      const item3 = createItem('500px', '0px', '1000px');

      TestBed.runInInjectionContext(() => {
        const engine = createEngine([item1, item2, item3], 1000, [], 'push', false);
        engine.setItemSize(item1, '200px');
        engine.setItemSize(item2, '300px');
        engine.setItemSize(item3, '500px');

        engine.startDrag(0, 200);
        engine.drag(0, 300); // +100px to item1

        expect(parseFloat(item1.size())).toBeCloseTo(300, 0);
        expect(parseFloat(item2.size())).toBeCloseTo(300, 0); // Unchanged
        expect(parseFloat(item3.size())).toBeCloseTo(500, 0); // Unchanged
      });
    });

    it('should fall back to adjacent when container is constrained', () => {
      const item1 = createItem('400px', '0px', '1000px');
      const item2 = createItem('400px', '0px', '1000px');

      TestBed.runInInjectionContext(() => {
        const engine = createEngine([item1, item2], 1000, [10], 'push', true);
        engine.setItemSize(item1, '400px');
        engine.setItemSize(item2, '400px');

        engine.startDrag(0, 400);
        engine.drag(0, 450);

        // Should behave like adjacent since constrained
        expect(parseFloat(item1.size())).toBeCloseTo(450, 0);
        expect(parseFloat(item2.size())).toBeCloseTo(350, 0);
      });
    });
  });

  describe('lockSizes', () => {
    it('lockSizes=false should keep original units after drag (adjacent)', () => {
      const item1 = createItem('1fr', '0px', '100%');
      const item2 = createItem('1fr', '0px', '100%');

      TestBed.runInInjectionContext(() => {
        const engine = createEngine([item1, item2], 1000, [10]);
        engine.setItemSize(item1, '1fr');
        engine.setItemSize(item2, '1fr');

        engine.startDrag(0, 500);
        engine.drag(0, 550);
        engine.endDrag(0, false);

        expect(item1.size()).toMatch(/fr$/);
        expect(item2.size()).toMatch(/fr$/);
      });
    });

    it('lockSizes=true should convert affected items to px (adjacent)', () => {
      const item1 = createItem('200px', '0px', '1000px');
      const item2 = createItem('1fr', '0px', '100%');
      const item3 = createItem('1fr', '0px', '100%');

      TestBed.runInInjectionContext(() => {
        const engine = createEngine([item1, item2, item3], 1000, [4, 4], 'adjacent', true, {
          lockSizes: true,
        });
        engine.setItemSize(item1, '200px');
        engine.setItemSize(item2, '1fr');
        engine.setItemSize(item3, '1fr');

        // Drag between item1 and item2 — item3 should not be affected
        engine.startDrag(0, 200);
        engine.drag(0, 250);
        engine.endDrag(0, false);

        expect(item1.size()).toMatch(/px$/); // Was px, still px
        expect(item2.size()).toMatch(/px$/); // Changed, locked to px
      });
    });
  });

  describe('ensureMinMaxSizes', () => {
    it('should clamp px items below min', () => {
      const item1 = createItem('50px', '100px', '500px');
      const item2 = createItem('200px', '100px', '500px');

      TestBed.runInInjectionContext(() => {
        const engine = createEngine([item1, item2], 1000);
        engine.ensureMinMaxSizes();

        expect(parseFloat(item1.size())).toEqual(100);
      });
    });

    it('should clamp px items above max', () => {
      const item1 = createItem('600px', '100px', '500px');
      const item2 = createItem('200px', '100px', '500px');

      TestBed.runInInjectionContext(() => {
        const engine = createEngine([item1, item2], 1000);
        engine.ensureMinMaxSizes();

        expect(parseFloat(item1.size())).toEqual(500);
      });
    });

    it('should handle empty items', () => {
      TestBed.runInInjectionContext(() => {
        const engine = createEngine([]);
        expect(() => engine.ensureMinMaxSizes()).not.toThrow();
      });
    });
  });

  describe('moveDivider', () => {
    it('should move divider by px delta', () => {
      const item1 = createItem('400px', '100px', '500px');
      const item2 = createItem('400px', '100px', '500px');

      TestBed.runInInjectionContext(() => {
        const engine = createEngine([item1, item2], 1000, [10]);
        engine.setItemSize(item1, '400px');
        engine.setItemSize(item2, '400px');

        engine.moveDivider(0, 50);

        expect(parseFloat(item1.size())).toBeCloseTo(450, 0);
        expect(parseFloat(item2.size())).toBeCloseTo(350, 0);
      });
    });

    it('should not move divider for invalid index', () => {
      const item1 = createItem('400px', '100px', '500px');

      TestBed.runInInjectionContext(() => {
        const engine = createEngine([item1], 1000);
        engine.setItemSize(item1, '400px');

        engine.moveDivider(0, 50);
        expect(item1.size()).toEqual('400px');
      });
    });
  });

  describe('Drag state', () => {
    it('should track drag context', () => {
      const item1 = createItem('400px');
      const item2 = createItem('400px');

      TestBed.runInInjectionContext(() => {
        const engine = createEngine([item1, item2]);

        expect(engine.isDragging()).toBe(false);

        engine.startDrag(0, 400);
        expect(engine.isDragging()).toBe(true);
        expect(engine.dragContext()!.dividerIndex).toBe(0);

        engine.endDrag(0, false);
        expect(engine.isDragging()).toBe(false);
      });
    });

    it('should ignore drag for invalid index', () => {
      const item1 = createItem('400px');

      TestBed.runInInjectionContext(() => {
        const engine = createEngine([item1]);
        engine.startDrag(0, 400);
        expect(engine.dragContext()).toBeNull();
      });
    });
  });

  describe('Proportional Mode - lockSizes', () => {
    it('should convert resized column back to fr when lockSizes=false (default)', () => {
      const item1 = createItem('2fr', '0px', '100%');
      const item2 = createItem('1fr', '0px', '100%');
      const item3 = createItem('1fr', '0px', '100%');

      TestBed.runInInjectionContext(() => {
        const engine = createEngine([item1, item2, item3], 1000, [], 'proportional');
        engine.setItemSize(item1, '2fr');
        engine.setItemSize(item2, '1fr');
        engine.setItemSize(item3, '1fr');

        engine.startDrag(0, 500);
        engine.drag(0, 600);
        engine.endDrag(0, false);

        // Default lockSizes=false → column converted back to fr
        expect(item1.size()).toMatch(/fr$/);
        expect(item2.size()).toBe('1fr');
        expect(item3.size()).toBe('1fr');
      });
    });

    it('should lock resized column to px when lockSizes=true', () => {
      const item1 = createItem('100px', '0px', '1000px');
      const item2 = createItem('2fr', '0px', '100%');
      const item3 = createItem('1fr', '0px', '100%');

      TestBed.runInInjectionContext(() => {
        const engine = createEngine([item1, item2, item3], 1000, [], 'proportional', true, {
          lockSizes: true,
        });
        engine.setItemSize(item1, '100px');
        engine.setItemSize(item2, '2fr');
        engine.setItemSize(item3, '1fr');

        engine.startDrag(0, 100);
        engine.drag(0, 250);
        engine.endDrag(0, false);

        expect(item1.size()).toMatch(/px$/);
        expect(item2.size()).toBe('2fr');
        expect(item3.size()).toBe('1fr');
      });
    });
  });

  describe('Proportional Mode - minItemSizePx', () => {
    it('should use minmax() in grid template for fr columns when minItemSizePx > 0', () => {
      const item1 = createItem('100px', '0px', '1000px');
      const item2 = createItem('2fr', '0px', '100%');
      const item3 = createItem('1fr', '0px', '100%');

      TestBed.runInInjectionContext(() => {
        const engine = createEngine([item1, item2, item3], 1000, [], 'proportional', true, {
          minItemSizePx: 50,
        });
        engine.setItemSize(item1, '100px');
        engine.setItemSize(item2, '2fr');
        engine.setItemSize(item3, '1fr');

        const template = engine.gridTemplateSizes();
        expect(template).toContain('minmax(50px, 2fr)');
        expect(template).toContain('minmax(50px, 1fr)');
        expect(template).toContain('100px');
      });
    });

    it('should not use minmax() when minItemSizePx is 0 (default)', () => {
      const item1 = createItem('100px');
      const item2 = createItem('2fr');

      TestBed.runInInjectionContext(() => {
        const engine = createEngine([item1, item2], 1000, [], 'proportional');
        const template = engine.gridTemplateSizes();
        expect(template).not.toContain('minmax');
      });
    });

    it('should cap resized column growth so other columns stay above minItemSizePx', () => {
      const item1 = createItem('100px', '0px', '1000px');
      const item2 = createItem('2fr', '0px', '100%');
      const item3 = createItem('1fr', '0px', '100%');

      TestBed.runInInjectionContext(() => {
        const engine = createEngine([item1, item2, item3], 1000, [], 'proportional', true, {
          minItemSizePx: 50,
        });
        engine.setItemSize(item1, '100px');
        engine.setItemSize(item2, '2fr');
        engine.setItemSize(item3, '1fr');

        engine.startDrag(0, 100);
        engine.drag(0, 950); // Try to grow item1 to 950px

        // item1 should be capped: 1000 - 2*50(fr columns) = 900px max
        expect(parseFloat(item1.size())).toBeLessThanOrEqual(900);
        expect(parseFloat(item1.size())).toBeGreaterThan(100);
      });
    });

    it('should not affect adjacent mode (no minmax in template)', () => {
      const item1 = createItem('100px');
      const item2 = createItem('2fr');
      const item3 = createItem('1fr');

      TestBed.runInInjectionContext(() => {
        const engine = createEngine([item1, item2, item3], 1000, [], 'adjacent', true, {
          minItemSizePx: 50,
        });
        const template = engine.gridTemplateSizes();
        // Adjacent resolves to px, no minmax
        expect(template).not.toContain('minmax');
        expect(template).toMatch(/px/);
      });
    });
  });

  describe('Proportional Mode - no overflow', () => {
    it('should never overflow container when growing a column to its maximum', () => {
      const item1 = createItem('100px', '0px', '1000px');
      const item2 = createItem('2fr', '0px', '100%');
      const item3 = createItem('1fr', '0px', '100%');
      const item4 = createItem('1fr', '0px', '100%');

      TestBed.runInInjectionContext(() => {
        const engine = createEngine([item1, item2, item3, item4], 1000, [], 'proportional', true, {
          minItemSizePx: 50,
        });
        engine.setItemSize(item1, '100px');
        engine.setItemSize(item2, '2fr');
        engine.setItemSize(item3, '1fr');
        engine.setItemSize(item4, '1fr');

        engine.startDrag(0, 100);
        engine.drag(0, 999); // Try maximum growth

        // Total of resized + other minimums should not exceed container
        const resizedPx = parseFloat(item1.size());
        const otherMinTotal = 3 * 50; // 3 fr columns × 50px floor
        expect(resizedPx + otherMinTotal).toBeLessThanOrEqual(1000);
      });
    });

    it('should work correctly when some columns are already locked to px', () => {
      const item1 = createItem('200px', '0px', '1000px');
      const item2 = createItem('300px', '0px', '1000px'); // already locked
      const item3 = createItem('1fr', '0px', '100%');
      const item4 = createItem('1fr', '0px', '100%');

      TestBed.runInInjectionContext(() => {
        const engine = createEngine([item1, item2, item3, item4], 1000, [], 'proportional', true, {
          minItemSizePx: 50,
        });
        engine.setItemSize(item1, '200px');
        engine.setItemSize(item2, '300px');
        engine.setItemSize(item3, '1fr');
        engine.setItemSize(item4, '1fr');

        engine.startDrag(0, 200);
        engine.drag(0, 800); // Try to grow a lot

        // Max: 1000 - 300(locked) - 2*50(fr floors) = 600
        expect(parseFloat(item1.size())).toBeLessThanOrEqual(600);
      });
    });
  });

  describe('Adjacent Mode - no overflow', () => {
    it('should keep total width constant after resize', () => {
      const item1 = createItem('200px', '50px', '800px');
      const item2 = createItem('300px', '50px', '800px');
      const item3 = createItem('500px', '50px', '800px');

      TestBed.runInInjectionContext(() => {
        const engine = createEngine([item1, item2, item3], 1000, [], 'adjacent', true, {
          minItemSizePx: 50,
        });
        engine.setItemSize(item1, '200px');
        engine.setItemSize(item2, '300px');
        engine.setItemSize(item3, '500px');

        engine.startDrag(0, 200);
        engine.drag(0, 700); // Large drag

        const total =
          parseFloat(item1.size()) + parseFloat(item2.size()) + parseFloat(item3.size());
        expect(total).toBeCloseTo(1000, 0);
      });
    });

    it('should cascade delta when neighbor hits min constraint', () => {
      const item1 = createItem('200px', '50px', '900px');
      const item2 = createItem('200px', '50px', '900px');
      const item3 = createItem('600px', '50px', '900px');

      TestBed.runInInjectionContext(() => {
        const engine = createEngine([item1, item2, item3], 1000, [], 'adjacent', true, {
          minItemSizePx: 50,
        });
        engine.setItemSize(item1, '200px');
        engine.setItemSize(item2, '200px');
        engine.setItemSize(item3, '600px');

        // Drag divider 0 right by 300 — item2 only has 150px to give (200-50)
        // Remaining delta should cascade to item3
        engine.startDrag(0, 200);
        engine.drag(0, 500);

        expect(parseFloat(item2.size())).toBeCloseTo(50, 0);
        // item3 absorbed the remainder
        expect(parseFloat(item3.size())).toBeLessThan(600);
        // Total still constant
        const total =
          parseFloat(item1.size()) + parseFloat(item2.size()) + parseFloat(item3.size());
        expect(total).toBeCloseTo(1000, 0);
      });
    });
  });

  describe('No-op click (zero movement)', () => {
    it('should not mark as resized on click without drag', () => {
      const item1 = createItem('100px', '0px', '1000px');
      const item2 = createItem('2fr');
      const item3 = createItem('1fr');

      TestBed.runInInjectionContext(() => {
        const engine = createEngine([item1, item2, item3], 1000, [], 'proportional', true);
        engine.setItemSize(item1, '100px');

        engine.startDrag(0, 100);
        engine.endDrag(0, false); // No drag() call

        expect(engine.hasBeenResized()).toBe(false);
      });
    });

    it('should revert baked sizes in push mode on no-op click', () => {
      const item1 = createItem('100px', '0px', '1000px');
      const item2 = createItem('2fr');
      const item3 = createItem('1fr');

      TestBed.runInInjectionContext(() => {
        const engine = createEngine([item1, item2, item3], 1000, [], 'push', false);

        engine.startDrag(0, 100);
        engine.endDrag(0, false); // No movement

        // Should revert to original fr units
        expect(item2.size()).toBe('2fr');
        expect(item3.size()).toBe('1fr');
        expect(engine.hasBeenResized()).toBe(false);
      });
    });
  });
});
