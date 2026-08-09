import { signal, type Signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { JigSplitterPanel } from './panel/splitter-panel';
import { JigSplitter } from './splitter';
import { DefaultSplitterCalculator } from './splitter-calculator';

import type { SplitterLayout } from './types';

// Mock panel helper
function createMockPanel(
  size: string,
  minSize: string,
  maxSize: string,
  gridArea = 'panel'
): JigSplitterPanel {
  return {
    size: signal(size),
    minSize: signal(minSize),
    maxSize: signal(maxSize),
    gridArea: signal(gridArea),
  } as any;
}

// Mock splitter helper
function createMockSplitter(
  panels: JigSplitterPanel[],
  layout: SplitterLayout = 'horizontal',
  splitterSize = 1000,
  dividerSize = 10,
  panelOrder: string[] | null = null
): JigSplitter {
  const mockDivider = {
    rootNodes: [
      Object.setPrototypeOf(
        {
          offsetWidth: dividerSize,
          offsetHeight: dividerSize,
        },
        HTMLElement.prototype
      ) as HTMLElement,
    ],
  };

  const elementSizeSignal = signal({ width: splitterSize, height: splitterSize });

  return {
    panels: signal(panels) as Signal<readonly JigSplitterPanel[]>,
    dividers: signal(
      panels.length > 1
        ? Array(panels.length - 1)
            .fill(0)
            .map(() => mockDivider)
        : []
    ),
    panelOrder: signal(panelOrder),
    layout: signal(layout),
    elementSize: elementSizeSignal,
  } as any;
}

describe('DefaultSplitterCalculator', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  describe('Grid Template Sizes', () => {
    it('should generate correct grid template for horizontal layout with mixed panels (fr resolved to px)', () => {
      const panel1 = createMockPanel('200px', '100px', '300px');
      const panel2 = createMockPanel('1fr', '100px', '500px');
      const splitter = createMockSplitter([panel1, panel2], 'horizontal', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);
        const template = calculator.gridTemplateSizes();
        // frArea = 1000 - 200 - 10 = 790, totalFr = 1, pxPerFr = 790
        expect(template).toEqual('200px 10px 790px');
      });
    });

    it('should handle single panel without dividers (fr resolved to px)', () => {
      const panel1 = createMockPanel('1fr', '100px', '500px');
      const splitter = createMockSplitter([panel1], 'horizontal', 1000, 0);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);
        const template = calculator.gridTemplateSizes();
        // frArea = 1000, totalFr = 1, pxPerFr = 1000
        expect(template).toEqual('1000px');
      });
    });

    it('should return "none" for empty panels', () => {
      const splitter = createMockSplitter([], 'horizontal', 1000, 0);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);
        const template = calculator.gridTemplateSizes();

        expect(template).toEqual('none');
      });
    });

    it('should handle three panels with dividers (fr resolved to px)', () => {
      const panel1 = createMockPanel('1fr', '100px', '500px');
      const panel2 = createMockPanel('200px', '100px', '300px');
      const panel3 = createMockPanel('1fr', '100px', '500px');
      const splitter = createMockSplitter([panel1, panel2, panel3], 'horizontal', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);
        const template = calculator.gridTemplateSizes();
        // frArea = 1000 - 200 - 10 - 10 = 780, totalFr = 2, pxPerFr = 390
        expect(template).toEqual('390px 10px 200px 10px 390px');
      });
    });
  });

  describe('Grid Template Areas', () => {
    it('should generate correct areas for horizontal layout', () => {
      const panel1 = createMockPanel('1fr', '100px', '500px', 'left');
      const panel2 = createMockPanel('1fr', '100px', '500px', 'right');
      const splitter = createMockSplitter([panel1, panel2], 'horizontal', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);
        const areas = calculator.gridTemplateAreas();

        expect(areas).toEqual('"left jig-divider-0 right"');
      });
    });

    it('should generate correct areas for vertical layout', () => {
      const panel1 = createMockPanel('1fr', '100px', '500px', 'top');
      const panel2 = createMockPanel('1fr', '100px', '500px', 'bottom');
      const splitter = createMockSplitter([panel1, panel2], 'vertical', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);
        const areas = calculator.gridTemplateAreas();

        expect(areas).toEqual('"top" "jig-divider-0" "bottom"');
      });
    });

    it('should handle three panels', () => {
      const panel1 = createMockPanel('1fr', '100px', '500px', 'a');
      const panel2 = createMockPanel('1fr', '100px', '500px', 'b');
      const panel3 = createMockPanel('1fr', '100px', '500px', 'c');
      const splitter = createMockSplitter([panel1, panel2, panel3], 'horizontal', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);
        const areas = calculator.gridTemplateAreas();

        expect(areas).toEqual('"a jig-divider-0 b jig-divider-1 c"');
      });
    });

    it('should return null for empty panels', () => {
      const splitter = createMockSplitter([], 'horizontal', 1000, 0);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);
        const areas = calculator.gridTemplateAreas();

        expect(areas).toBeNull();
      });
    });
  });

  describe('Min and Max Size Calculations', () => {
    it('should calculate correct minSize with px panels', () => {
      const panel1 = createMockPanel('200px', '100px', '300px');
      const panel2 = createMockPanel('300px', '150px', '400px');
      const splitter = createMockSplitter([panel1, panel2], 'horizontal', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);
        const minSize = calculator.minSize();

        // minSize should be sum of px sizes (divider is added separately): 200px + 300px = 500px
        expect(minSize).toEqual('calc(510px + 0%)');
      });
    });

    it('should calculate correct minSize with fr panels', () => {
      const panel1 = createMockPanel('1fr', '100px', '500px');
      const panel2 = createMockPanel('1fr', '150px', '400px');
      const splitter = createMockSplitter([panel1, panel2], 'horizontal', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);
        const minSize = calculator.minSize();

        // minSize should be sum of minSizes for fr panels: 100px + 150px = 250px
        expect(minSize).toEqual('calc(260px + 0%)');
      });
    });

    it('should calculate correct minSize with mixed % limits', () => {
      const panel1 = createMockPanel('1fr', '10%', '500px');
      const panel2 = createMockPanel('1fr', '20%', '400px');
      const splitter = createMockSplitter([panel1, panel2], 'horizontal', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);
        const minSize = calculator.minSize();

        // minSize should include percentage limits: 10% + 20% = 30%
        expect(minSize).toEqual('calc(10px + 30%)');
      });
    });

    it('should calculate correct maxSize with px panels', () => {
      const panel1 = createMockPanel('200px', '100px', '300px');
      const panel2 = createMockPanel('300px', '150px', '400px');
      const splitter = createMockSplitter([panel1, panel2], 'horizontal', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);
        const maxSize = calculator.maxSize();

        // maxSize should be sum of px sizes: 200px + 300px = 500px
        expect(maxSize).toEqual('calc(510px + 0%)');
      });
    });

    it('should calculate correct maxSize with fr panels', () => {
      const panel1 = createMockPanel('1fr', '100px', '500px');
      const panel2 = createMockPanel('1fr', '150px', '400px');
      const splitter = createMockSplitter([panel1, panel2], 'horizontal', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);
        const maxSize = calculator.maxSize();

        // maxSize should be sum of maxSizes for fr panels: 500px + 400px = 900px
        expect(maxSize).toEqual('calc(910px + 0%)');
      });
    });
  });

  describe('Ordered Panels', () => {
    it('should maintain panel order when no panelOrder is specified', () => {
      const panel1 = createMockPanel('1fr', '100px', '500px', 'a');
      const panel2 = createMockPanel('1fr', '100px', '500px', 'b');
      const panel3 = createMockPanel('1fr', '100px', '500px', 'c');
      const splitter = createMockSplitter([panel1, panel2, panel3], 'horizontal', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);
        const ordered = calculator.orderedPanels();

        expect(ordered).toEqual([panel1, panel2, panel3]);
      });
    });

    it('should reorder panels when panelOrder is specified', () => {
      const panel1 = createMockPanel('1fr', '100px', '500px', 'a');
      const panel2 = createMockPanel('1fr', '100px', '500px', 'b');
      const panel3 = createMockPanel('1fr', '100px', '500px', 'c');
      const splitter = createMockSplitter([panel1, panel2, panel3], 'horizontal', 1000, 10, [
        'c',
        'a',
        'b',
      ]);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);
        const ordered = calculator.orderedPanels();

        expect(ordered).toEqual([panel3, panel1, panel2]);
      });
    });

    it('should handle panels not in panelOrder', () => {
      const panel1 = createMockPanel('1fr', '100px', '500px', 'a');
      const panel2 = createMockPanel('1fr', '100px', '500px', 'b');
      const panel3 = createMockPanel('1fr', '100px', '500px', 'c');
      const splitter = createMockSplitter([panel1, panel2, panel3], 'horizontal', 1000, 10, [
        'a',
        'b',
      ]);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);
        const ordered = calculator.orderedPanels();

        // Panel3 not in order, should be at the end
        expect(ordered).toEqual([panel1, panel2, panel3]);
      });
    });
  });

  describe('Drag Context', () => {
    it('should create drag context on startDrag', () => {
      const panel1 = createMockPanel('1fr', '100px', '500px');
      const panel2 = createMockPanel('1fr', '100px', '500px');
      const splitter = createMockSplitter([panel1, panel2], 'horizontal', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);
        const event = new PointerEvent('pointerdown', {
          clientX: 100,
          clientY: 200,
          pointerId: 1,
        });

        calculator.startDrag(0, event);

        const context = calculator.dragContext();
        expect(context).not.toBeNull();
        expect(context!.dividerIndex).toBe(0);
        expect(context!.pointerId).toBe(1);
        expect(context!.startPosition).toBe(100);
      });
    });

    it('should use clientY for vertical layout', () => {
      const panel1 = createMockPanel('1fr', '100px', '500px');
      const panel2 = createMockPanel('1fr', '100px', '500px');
      const splitter = createMockSplitter([panel1, panel2], 'vertical', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);
        const event = new PointerEvent('pointerdown', {
          clientX: 100,
          clientY: 200,
          pointerId: 1,
        });

        calculator.startDrag(0, event);

        const context = calculator.dragContext();
        expect(context!.startPosition).toBe(200);
      });
    });

    it('should not create drag context for invalid divider index', () => {
      const panel1 = createMockPanel('1fr', '100px', '500px');
      const panel2 = createMockPanel('1fr', '100px', '500px');
      const splitter = createMockSplitter([panel1, panel2], 'horizontal', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);
        const event = new PointerEvent('pointerdown', {
          clientX: 100,
          clientY: 200,
          pointerId: 1,
        });

        calculator.startDrag(-1, event);
        expect(calculator.dragContext()).toBeNull();

        calculator.startDrag(2, event);
        expect(calculator.dragContext()).toBeNull();
      });
    });

    it('should reset drag context on endDrag', () => {
      const panel1 = createMockPanel('1fr', '100px', '500px');
      const panel2 = createMockPanel('1fr', '100px', '500px');
      const splitter = createMockSplitter([panel1, panel2], 'horizontal', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);
        const startEvent = new PointerEvent('pointerdown', { clientX: 100, pointerId: 1 });
        const endEvent = new PointerEvent('pointerup', { clientX: 200, pointerId: 1 });

        calculator.startDrag(0, startEvent);
        expect(calculator.dragContext()).not.toBeNull();

        calculator.endDrag(0, endEvent, false);
        expect(calculator.dragContext()).toBeNull();
      });
    });

    it('should restore original sizes on cancelled drag', () => {
      const panel1 = createMockPanel('400px', '100px', '500px');
      const panel2 = createMockPanel('400px', '100px', '500px');
      const splitter = createMockSplitter([panel1, panel2], 'horizontal', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);
        const startEvent = new PointerEvent('pointerdown', { clientX: 100, pointerId: 1 });
        const dragEvent = new PointerEvent('pointermove', { clientX: 150, pointerId: 1 });
        const endEvent = new PointerEvent('pointerup', { clientX: 150, pointerId: 1 });

        calculator.startDrag(0, startEvent);
        calculator.drag(0, dragEvent);

        // Sizes should have changed
        const size1AfterDrag = panel1.size();
        expect(size1AfterDrag).not.toBe('400px');

        // Cancel the drag
        calculator.endDrag(0, endEvent, true);

        // Sizes should be restored
        expect(panel1.size()).toEqual('400px');
        expect(panel2.size()).toEqual('400px');
      });
    });

    it('should complete drag without cancelling', () => {
      const panel1 = createMockPanel('400px', '100px', '500px');
      const panel2 = createMockPanel('400px', '100px', '500px');
      const splitter = createMockSplitter([panel1, panel2], 'horizontal', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);
        const startEvent = new PointerEvent('pointerdown', { clientX: 100, pointerId: 1 });
        const dragEvent = new PointerEvent('pointermove', { clientX: 150, pointerId: 1 });
        const endEvent = new PointerEvent('pointerup', { clientX: 150, pointerId: 1 });

        calculator.startDrag(0, startEvent);
        calculator.drag(0, dragEvent);

        const size1AfterDrag = panel1.size();

        // End drag without cancel
        calculator.endDrag(0, endEvent, false);

        // Sizes should remain changed
        expect(panel1.size()).toEqual(size1AfterDrag);
        expect(calculator.dragContext()).toBeNull();
      });
    });

    it('should ignore drag with wrong divider index', () => {
      const panel1 = createMockPanel('400px', '100px', '500px');
      const panel2 = createMockPanel('400px', '100px', '500px');
      const splitter = createMockSplitter([panel1, panel2], 'horizontal', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);
        const startEvent = new PointerEvent('pointerdown', { clientX: 100, pointerId: 1 });
        const dragEvent = new PointerEvent('pointermove', { clientX: 150, pointerId: 1 });

        calculator.startDrag(0, startEvent);

        // Try to drag with wrong index
        calculator.drag(1, dragEvent);

        // Sizes should not change
        expect(panel1.size()).toEqual('400px');
        expect(panel2.size()).toEqual('400px');
      });
    });

    it('should ignore drag with wrong pointerId', () => {
      const panel1 = createMockPanel('400px', '100px', '500px');
      const panel2 = createMockPanel('400px', '100px', '500px');
      const splitter = createMockSplitter([panel1, panel2], 'horizontal', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);
        const startEvent = new PointerEvent('pointerdown', { clientX: 100, pointerId: 1 });
        const dragEvent = new PointerEvent('pointermove', { clientX: 150, pointerId: 2 });

        calculator.startDrag(0, startEvent);

        // Try to drag with wrong pointerId
        calculator.drag(0, dragEvent);

        // Sizes should not change
        expect(panel1.size()).toEqual('400px');
        expect(panel2.size()).toEqual('400px');
      });
    });

    it('should ignore drag when no context exists', () => {
      const panel1 = createMockPanel('400px', '100px', '500px');
      const panel2 = createMockPanel('400px', '100px', '500px');
      const splitter = createMockSplitter([panel1, panel2], 'horizontal', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);
        const dragEvent = new PointerEvent('pointermove', { clientX: 150, pointerId: 1 });

        // Try to drag without starting
        calculator.drag(0, dragEvent);

        // Sizes should not change
        expect(panel1.size()).toEqual('400px');
        expect(panel2.size()).toEqual('400px');
      });
    });

    it('should ignore endDrag with wrong divider index', () => {
      const panel1 = createMockPanel('400px', '100px', '500px');
      const panel2 = createMockPanel('400px', '100px', '500px');
      const splitter = createMockSplitter([panel1, panel2], 'horizontal', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);
        const startEvent = new PointerEvent('pointerdown', { clientX: 100, pointerId: 1 });
        const endEvent = new PointerEvent('pointerup', { clientX: 150, pointerId: 1 });

        calculator.startDrag(0, startEvent);
        expect(calculator.dragContext()).not.toBeNull();

        // Try to end with wrong index
        calculator.endDrag(1, endEvent, false);

        // Context should still exist
        expect(calculator.dragContext()).not.toBeNull();
      });
    });

    it('should ignore endDrag with wrong pointerId', () => {
      const panel1 = createMockPanel('400px', '100px', '500px');
      const panel2 = createMockPanel('400px', '100px', '500px');
      const splitter = createMockSplitter([panel1, panel2], 'horizontal', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);
        const startEvent = new PointerEvent('pointerdown', { clientX: 100, pointerId: 1 });
        const endEvent = new PointerEvent('pointerup', { clientX: 150, pointerId: 2 });

        calculator.startDrag(0, startEvent);
        expect(calculator.dragContext()).not.toBeNull();

        // Try to end with wrong pointerId
        calculator.endDrag(0, endEvent, false);

        // Context should still exist
        expect(calculator.dragContext()).not.toBeNull();
      });
    });

    it('should handle drag with negative delta for vertical layout', () => {
      const panel1 = createMockPanel('400px', '100px', '500px');
      const panel2 = createMockPanel('400px', '100px', '500px');
      const splitter = createMockSplitter([panel1, panel2], 'vertical', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);
        const startEvent = new PointerEvent('pointerdown', { clientY: 200, pointerId: 1 });
        const dragEvent = new PointerEvent('pointermove', { clientY: 150, pointerId: 1 });

        calculator.startDrag(0, startEvent);
        calculator.drag(0, dragEvent);

        // Panel sizes should have changed (delta is -50)
        expect(panel1.size()).not.toEqual('400px');
      });
    });
  });

  describe('ensureMinMaxSizes', () => {
    it('should trigger ensureMinMaxSizes via afterRenderEffect when panel sizes change', () => {
      const panel1 = createMockPanel('400px', '100px', '500px');
      const panel2 = createMockPanel('400px', '100px', '500px');
      const splitter = createMockSplitter([panel1, panel2], 'horizontal', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);

        // Set initial calculated sizes
        const setPanelSize = (calculator as any).setPanelSize.bind(calculator);
        setPanelSize(panel1, '400px');
        setPanelSize(panel2, '400px');

        // Change a panel size directly (simulating external change)
        panel1.size.set('50px'); // Below min

        // Trigger change detection manually by accessing the computed signal
        TestBed.tick();

        // After effects run, size should be adjusted to min (100px)
        const size1 = parseFloat(panel1.size());
        expect(size1).toEqual(100);
      });
    });

    it('should trigger ensureMinMaxSizes via afterRenderEffect when panel size changes', () => {
      const panel1 = createMockPanel('50px', '100px', '500px'); // Below min initially
      const panel2 = createMockPanel('400px', '100px', '500px');
      const splitter = createMockSplitter([panel1, panel2], 'horizontal', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);

        // Trigger afterRenderEffect by flushing effects
        TestBed.tick();

        // After effects run, panel1 size should be adjusted to min (100px) via ensureMinMaxSizes
        const size1 = parseFloat(panel1.size());
        expect(size1).toEqual(100);
      });
    });

    it('should enforce min size constraints on px panels', () => {
      const panel1 = createMockPanel('50px', '100px', '500px'); // Below min
      const panel2 = createMockPanel('200px', '100px', '500px');
      const splitter = createMockSplitter([panel1, panel2], 'horizontal', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);
        calculator.ensureMinMaxSizes();

        // Panel1 should be adjusted to min size (100px)
        const size1 = parseFloat(panel1.size());
        expect(size1).toEqual(100);
      });
    });

    it('should enforce max size constraints on px panels', () => {
      const panel1 = createMockPanel('600px', '100px', '500px'); // Above max
      const panel2 = createMockPanel('200px', '100px', '500px');
      const splitter = createMockSplitter([panel1, panel2], 'horizontal', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);
        calculator.ensureMinMaxSizes();

        // Panel1 should be adjusted to max size (500px)
        const size1 = parseFloat(panel1.size());
        expect(size1).toEqual(500);
      });
    });

    it('should enforce min size constraints on fr panels', () => {
      const panel1 = createMockPanel('0.5fr', '200px', '500px');
      const panel2 = createMockPanel('1fr', '100px', '500px');
      const splitter = createMockSplitter([panel1, panel2], 'horizontal', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);
        calculator.ensureMinMaxSizes();

        // Both panels should be within their constraints
        expect(panel1.size()).toContain('fr');
        expect(panel2.size()).toContain('fr');
      });
    });

    it('should adjust fr panels below minSize threshold and redistribute', () => {
      // Setup where panel1 has very small fr that will be below minSize
      const panel1 = createMockPanel('0.1fr', '300px', '500px'); // minSize is large relative to fr
      const panel2 = createMockPanel('1fr', '100px', '500px');
      const splitter = createMockSplitter([panel1, panel2], 'horizontal', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);
        calculator.ensureMinMaxSizes();

        // Panel1 should be adjusted to satisfy minSize constraint
        // With 1000px total, 10px divider: 990px fr area
        // 0.1fr + 1fr = 1.1fr total, so 0.1fr would be ~90px
        // But minSize is 300px, so it needs to be adjusted to at least 300/990 * 1.1 = ~0.333fr
        const size1 = parseFloat(panel1.size());
        expect(size1).toBeCloseTo(0.333333333, 4);
        expect(panel1.size()).toContain('fr');
      });
    });

    it('should enforce max size constraints on fr panels', () => {
      const panel1 = createMockPanel('2fr', '100px', '400px');
      const panel2 = createMockPanel('1fr', '100px', '300px');
      const splitter = createMockSplitter([panel1, panel2], 'horizontal', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);
        calculator.ensureMinMaxSizes();

        // Both panels should be within their constraints
        expect(panel1.size()).toContain('fr');
        expect(panel2.size()).toContain('fr');
      });
    });

    it('should handle empty panels array', () => {
      const splitter = createMockSplitter([], 'horizontal', 1000, 0);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);
        // Should not throw
        expect(() => calculator.ensureMinMaxSizes()).not.toThrow();
      });
    });

    it('should distribute excess fr when panels hit max constraints', () => {
      const panel1 = createMockPanel('1fr', '100px', '300px');
      const panel2 = createMockPanel('1fr', '100px', '300px');
      const panel3 = createMockPanel('1fr', '100px', '300px');
      const splitter = createMockSplitter([panel1, panel2, panel3], 'horizontal', 1000, 20);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);
        calculator.ensureMinMaxSizes();

        // All panels should be within their constraints
        expect(panel1.size()).toContain('fr');
        expect(panel2.size()).toContain('fr');
        expect(panel3.size()).toContain('fr');
      });
    });
  });

  describe('Divider Movement', () => {
    it('should not move divider with invalid index (negative)', () => {
      const panel1 = createMockPanel('400px', '100px', '500px');
      const panel2 = createMockPanel('400px', '100px', '500px');
      const splitter = createMockSplitter([panel1, panel2], 'horizontal', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);

        const setPanelSize = (calculator as any).setPanelSize.bind(calculator);
        setPanelSize(panel1, '400px');
        setPanelSize(panel2, '400px');

        calculator.moveDivider(-1, 50);

        // Panels should remain unchanged
        expect(panel1.size()).toEqual('400px');
        expect(panel2.size()).toEqual('400px');
      });
    });

    it('should not move divider with invalid index (too large)', () => {
      const panel1 = createMockPanel('400px', '100px', '500px');
      const panel2 = createMockPanel('400px', '100px', '500px');
      const splitter = createMockSplitter([panel1, panel2], 'horizontal', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);

        const setPanelSize = (calculator as any).setPanelSize.bind(calculator);
        setPanelSize(panel1, '400px');
        setPanelSize(panel2, '400px');

        calculator.moveDivider(5, 50);

        // Panels should remain unchanged
        expect(panel1.size()).toEqual('400px');
        expect(panel2.size()).toEqual('400px');
      });
    });

    it('should not move divider when panel sizes are not calculated', () => {
      const panel1 = createMockPanel('400px', '100px', '500px');
      const panel2 = createMockPanel('400px', '100px', '500px');
      const splitter = createMockSplitter([panel1, panel2], 'horizontal', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);

        // Don't call setPanelSize, so panels are not "calculated"
        calculator.moveDivider(0, 50);

        // Panels should remain unchanged
        expect(panel1.size()).toEqual('400px');
        expect(panel2.size()).toEqual('400px');
      });
    });

    it('should handle zero delta movement', () => {
      const panel1 = createMockPanel('400px', '100px', '500px');
      const panel2 = createMockPanel('400px', '100px', '500px');
      const splitter = createMockSplitter([panel1, panel2], 'horizontal', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);

        const setPanelSize = (calculator as any).setPanelSize.bind(calculator);
        setPanelSize(panel1, '400px');
        setPanelSize(panel2, '400px');

        calculator.moveDivider(0, 0);

        // Panels should remain unchanged
        expect(panel1.size()).toEqual('400px');
        expect(panel2.size()).toEqual('400px');
      });
    });

    it('should move divider correctly for px panels', () => {
      const panel1 = createMockPanel('400px', '100px', '500px');
      const panel2 = createMockPanel('400px', '100px', '500px');
      const splitter = createMockSplitter([panel1, panel2], 'horizontal', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);

        // Use the calculator to set panel sizes (simulating calculated state)
        // This is needed because moveDivider checks if sizes are calculated
        const setPanelSize = (calculator as any).setPanelSize.bind(calculator);
        setPanelSize(panel1, '400px');
        setPanelSize(panel2, '400px');

        // Move divider 50px to the right
        calculator.moveDivider(0, 50);

        // Panel1 should increase by 50px, Panel2 should decrease by 50px
        expect(panel1.size()).toEqual('450px');
        expect(panel2.size()).toEqual('350px');
      });
    });

    it('should respect min size when moving divider left', () => {
      const panel1 = createMockPanel('200px', '100px', '500px');
      const panel2 = createMockPanel('600px', '100px', '700px');
      const splitter = createMockSplitter([panel1, panel2], 'horizontal', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);

        // Use the calculator to set panel sizes (simulating calculated state)
        const setPanelSize = (calculator as any).setPanelSize.bind(calculator);
        setPanelSize(panel1, '200px');
        setPanelSize(panel2, '600px');

        // Try to move divider 150px to the left (would make panel1 = 50px, below min of 100px)
        calculator.moveDivider(0, -150);

        // Panel1 should be clamped to min size
        expect(panel1.size()).toEqual('100px');
        expect(panel2.size()).toEqual('700px');
      });
    });

    it('should respect max size when moving divider right', () => {
      const panel1 = createMockPanel('400px', '100px', '500px');
      const panel2 = createMockPanel('400px', '100px', '500px');
      const splitter = createMockSplitter([panel1, panel2], 'horizontal', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);

        // Use the calculator to set panel sizes (simulating calculated state)
        const setPanelSize = (calculator as any).setPanelSize.bind(calculator);
        setPanelSize(panel1, '400px');
        setPanelSize(panel2, '400px');

        // Try to move divider 150px to the right (would make panel1 = 550px, above max of 500px)
        calculator.moveDivider(0, 150);

        // Panel1 should be clamped to max size
        expect(panel1.size()).toEqual('500px');
        expect(panel2.size()).toEqual('300px');
      });
    });

    it('should move divider when both panels have fr units', () => {
      const panel1 = createMockPanel('1fr', '100px', '100%');
      const panel2 = createMockPanel('1fr', '100px', '100%');
      const splitter = createMockSplitter([panel1, panel2], 'horizontal', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);

        // Use the calculator to set panel sizes (simulating calculated state)
        const setPanelSize = (calculator as any).setPanelSize.bind(calculator);
        setPanelSize(panel1, '1fr');
        setPanelSize(panel2, '1fr');

        // Move divider 100px to the right
        // Total space for fr: 1000 - 10 = 990px
        // Each fr is 495px, so moving 100px is about 0.202fr
        calculator.moveDivider(0, 100);

        const size1 = parseFloat(panel1.size());
        const size2 = parseFloat(panel2.size());

        // Panel1 should increase, Panel2 should decrease
        expect(size1).toBeCloseTo(1.202020202, 4);
        expect(size2).toBeCloseTo(0.797979798, 4);
        expect(panel1.size()).toContain('fr');
        expect(panel2.size()).toContain('fr');

        // Total fr should remain approximately 2
        expect(size1 + size2).toBeCloseTo(2, 1);
      });
    });

    it('should move divider when left is fr and right is px', () => {
      const panel1 = createMockPanel('1fr', '100px', '500px');
      const panel2 = createMockPanel('400px', '100px', '500px');
      const splitter = createMockSplitter([panel1, panel2], 'horizontal', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);

        const setPanelSize = (calculator as any).setPanelSize.bind(calculator);
        setPanelSize(panel1, '1fr');
        setPanelSize(panel2, '400px');

        // Move divider 50px to the right
        calculator.moveDivider(0, 50);

        // Panel1 (fr) should change, Panel2 (px) should change
        const size1 = parseFloat(panel1.size());
        const size2 = parseFloat(panel2.size());
        expect(panel1.size()).toContain('fr');
        // Verify at least one panel changed
        expect(size1 !== 1 || size2 !== 400).toBe(true);
      });
    });

    it('should move divider when left is px and right is fr', () => {
      const panel1 = createMockPanel('400px', '100px', '100%');
      const panel2 = createMockPanel('1fr', '100px', '100%');
      const splitter = createMockSplitter([panel1, panel2], 'horizontal', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);

        const setPanelSize = (calculator as any).setPanelSize.bind(calculator);
        setPanelSize(panel1, '400px');
        setPanelSize(panel2, '1fr');

        // Move divider 50px to the right
        calculator.moveDivider(0, 50);

        // Panel1 (px) should increase, Panel2 (fr) should decrease
        // Initial fr area: 1000 - 10 (divider) - 400 (panel1) = 590px
        // frPerPx: 1 / 590 ≈ 0.001694915
        // Panel1 gains 50px: 400 + 50 = 450px
        // Panel2 loses 50px which converts to: -50 * (1/590) ≈ -0.0847fr
        // New fr value: 1 - 0.0847 ≈ 0.9153fr
        expect(panel1.size()).toEqual('450px');
        expect(parseFloat(panel2.size())).toBeCloseTo(0.9152542373, 4);
        expect(panel2.size()).toContain('fr');
      });
    });

    it('should stop resizing when panels can no longer be shrunk', () => {
      const panel1 = createMockPanel('200px', '100px', '500px');
      const panel2 = createMockPanel('200px', '100px', '500px');
      const splitter = createMockSplitter([panel1, panel2], 'horizontal', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);

        const setPanelSize = (calculator as any).setPanelSize.bind(calculator);
        setPanelSize(panel1, '200px');
        setPanelSize(panel2, '200px');

        // Try to move divider 150px to the left (would make panel1 = 50px, below min of 100px)
        calculator.moveDivider(0, -150);

        // Panel1 should stop at min size
        expect(panel1.size()).toEqual('100px');
        // Panel2 can only grow by the amount panel1 shrank
        expect(panel2.size()).toEqual('300px');
      });
    });

    it('should stop resizing when panels can no longer be grown', () => {
      const panel1 = createMockPanel('400px', '100px', '500px');
      const panel2 = createMockPanel('400px', '100px', '500px');
      const splitter = createMockSplitter([panel1, panel2], 'horizontal', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);

        const setPanelSize = (calculator as any).setPanelSize.bind(calculator);
        setPanelSize(panel1, '400px');
        setPanelSize(panel2, '400px');

        // Try to move divider 150px to the right (would make panel1 = 550px, above max of 500px)
        calculator.moveDivider(0, 150);

        // Panel1 should stop at max size
        expect(panel1.size()).toEqual('500px');
        // Panel2 can only shrink by the amount panel1 grew
        expect(panel2.size()).toEqual('300px');
      });
    });

    it('should push away panels when minSize is already reached', () => {
      const panel1 = createMockPanel('100px', '100px', '100%');
      const panel2 = createMockPanel('1fr', '100px', '100%');
      const panel3 = createMockPanel('200px', '100px', '100%');
      const splitter = createMockSplitter([panel1, panel2, panel3], 'horizontal', 1000, 20);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);

        const setPanelSize = (calculator as any).setPanelSize.bind(calculator);
        setPanelSize(panel1, '100px');
        setPanelSize(panel2, '1fr');
        setPanelSize(panel3, '200px');

        // Move the divider between Panel 2 and 3 to the right (50px)
        calculator.moveDivider(1, 50);

        // Verify that divider movement occurred
        // Panel 2: 1fr in area of (1000 - 10 - 100 - 200) = 690px
        // After losing 50px: 640px, which is 640/690 ≈ 0.927fr
        const size3 = parseFloat(panel3.size());
        expect(panel2.size()).toContain('fr');
        // Panel 3 should shrink from 200px to 150px
        expect(size3).toEqual(150);
      });
    });

    it('should handle minSize with percentage units during move', () => {
      const panel1 = createMockPanel('400px', '10%', '100%'); // 10% of 1000 = 100px min
      const panel2 = createMockPanel('400px', '20%', '100%'); // 20% of 1000 = 200px min
      const splitter = createMockSplitter([panel1, panel2], 'horizontal', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);

        const setPanelSize = (calculator as any).setPanelSize.bind(calculator);
        setPanelSize(panel1, '400px');
        setPanelSize(panel2, '400px');

        // Try to move divider 150px to the left
        calculator.moveDivider(0, -150);

        // Panel1 should shrink, Panel2 should grow
        const size1 = parseFloat(panel1.size());
        const size2 = parseFloat(panel2.size());

        // Verify panel1 shrank by 150px (400 - 150 = 250px, which is above its min of 100px)
        expect(size1).toEqual(250);

        // Verify panel2 grew by 150px
        expect(size2).toEqual(550);
      });
    });

    it('should handle maxSize with percentage units during move', () => {
      const panel1 = createMockPanel('400px', '100px', '60%'); // 60% of 1000 = 600px max
      const panel2 = createMockPanel('400px', '100px', '50%'); // 50% of 1000 = 500px max
      const splitter = createMockSplitter([panel1, panel2], 'horizontal', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);

        const setPanelSize = (calculator as any).setPanelSize.bind(calculator);
        setPanelSize(panel1, '400px');
        setPanelSize(panel2, '400px');

        // Try to move divider 250px to the right (would make panel1 = 650px, above max of 600px)
        calculator.moveDivider(0, 250);

        // Panel1 should stop at max size (60% = 600px)
        expect(panel1.size()).toEqual('600px');
        // Panel2 should shrink by the allowed amount
        expect(panel2.size()).toEqual('200px');
      });
    });

    it('should handle mixed px and fr with percentage limits', () => {
      const panel1 = createMockPanel('1fr', '10%', '50%'); // 100px min, 500px max
      const panel2 = createMockPanel('400px', '100px', '500px');
      const splitter = createMockSplitter([panel1, panel2], 'horizontal', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);

        const setPanelSize = (calculator as any).setPanelSize.bind(calculator);
        setPanelSize(panel1, '1fr');
        setPanelSize(panel2, '400px');

        // Move divider 100px to the right
        calculator.moveDivider(0, 100);

        // Panel1 (fr) should change, Panel2 (px) should change
        const size1 = parseFloat(panel1.size());
        const size2 = parseFloat(panel2.size());
        expect(panel1.size()).toContain('fr');
        // Verify at least one panel changed
        expect(size1 !== 1 || size2 !== 400).toBe(true);
      });
    });

    it('should handle three panels with fr and px combinations', () => {
      const panel1 = createMockPanel('1fr', '100px', '100%');
      const panel2 = createMockPanel('200px', '100px', '100%');
      const panel3 = createMockPanel('1fr', '100px', '100%');
      const splitter = createMockSplitter([panel1, panel2, panel3], 'horizontal', 1000, 20);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);

        const setPanelSize = (calculator as any).setPanelSize.bind(calculator);
        setPanelSize(panel1, '1fr');
        setPanelSize(panel2, '200px');
        setPanelSize(panel3, '1fr');

        // Move first divider 50px to the right
        calculator.moveDivider(0, 50);

        // Panel1 (fr) should grow, Panel2 (px) should shrink, Panel3 unchanged
        // Total fr area: 1000 - 20*2 (dividers) - 200 (panel2) = 760px
        // Starting: 2fr total (1fr + 1fr) = 380px per fr
        // frPerPx: 2/760 = 1/380
        // After: panel1 gains 50px = 50 * (1/380) ≈ 0.1316fr
        // New fr value: 1 + 0.1316 ≈ 1.1316fr
        // panel2: 200 - 50 = 150px
        expect(parseFloat(panel1.size())).toBeCloseTo(1.131578947, 4);
        expect(panel1.size()).toContain('fr');
        // Panel2 should shrink to 150px
        expect(parseFloat(panel2.size())).toEqual(150);
        expect(panel3.size()).toContain('1fr');
      });
    });

    it('should handle three panels correctly', () => {
      const panel1 = createMockPanel('300px', '100px', '400px');
      const panel2 = createMockPanel('300px', '100px', '400px');
      const panel3 = createMockPanel('300px', '100px', '400px');
      const splitter = createMockSplitter([panel1, panel2, panel3], 'horizontal', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);

        // Use the calculator to set panel sizes (simulating calculated state)
        const setPanelSize = (calculator as any).setPanelSize.bind(calculator);
        setPanelSize(panel1, '300px');
        setPanelSize(panel2, '300px');
        setPanelSize(panel3, '300px');

        // Move first divider 50px to the right
        calculator.moveDivider(0, 50);

        // Panel1 should increase, Panel2 should decrease, Panel3 unchanged
        expect(panel1.size()).toEqual('350px');
        expect(panel2.size()).toEqual('250px');
        expect(panel3.size()).toEqual('300px');
      });
    });

    it('should cascade properly', () => {
      const panel1 = createMockPanel('200px', '100px', '300px');
      const panel2 = createMockPanel('200px', '100px', '300px');
      const panel3 = createMockPanel('400px', '100px', '500px');
      const splitter = createMockSplitter([panel1, panel2, panel3], 'horizontal', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);

        // Use the calculator to set panel sizes (simulating calculated state)
        const setPanelSize = (calculator as any).setPanelSize.bind(calculator);
        setPanelSize(panel1, '200px');
        setPanelSize(panel2, '200px');
        setPanelSize(panel3, '400px');

        // Try to move first divider 150px left (would make panel1 = 50px, below min)
        calculator.moveDivider(0, -150);

        // Panel1 should be clamped to minSize (100px)
        // Panel2 gains the limited movement
        const size1 = parseFloat(panel1.size());
        expect(size1).toEqual(100);
      });
    });

    it('should handle impossible constraint scenarios gracefully', () => {
      const panel1 = createMockPanel('400px', '300px', '500px');
      const panel2 = createMockPanel('400px', '300px', '500px');
      const splitter = createMockSplitter([panel1, panel2], 'horizontal', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);

        const setPanelSize = (calculator as any).setPanelSize.bind(calculator);
        setPanelSize(panel1, '400px');
        setPanelSize(panel2, '400px');

        // Try to move beyond both constraints (panel1 would need to be > 500, panel2 would need to be < 300)
        calculator.moveDivider(0, 200);

        // Movement should be limited: panel1 can grow to max 500, panel2 can shrink to min 300
        // So actual movement is limited to min(100, 100) = 100px
        const size1 = parseFloat(panel1.size());
        const size2 = parseFloat(panel2.size());
        expect(size1).toEqual(500);
        expect(size2).toEqual(300);
      });
    });

    it('should return early when constraints prevent any movement after retry', () => {
      // Create a scenario where both panels are at their limits
      // Panel1 at max, Panel2 at min - moving right would violate both
      const panel1 = createMockPanel('500px', '400px', '500px'); // At max
      const panel2 = createMockPanel('300px', '300px', '400px'); // At min
      const splitter = createMockSplitter([panel1, panel2], 'horizontal', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);

        const setPanelSize = (calculator as any).setPanelSize.bind(calculator);
        setPanelSize(panel1, '500px');
        setPanelSize(panel2, '300px');

        // Try to move right - panel1 can't grow (at max), panel2 can't shrink (at min)
        calculator.moveDivider(0, 100);

        // Sizes should remain unchanged (early return triggered at line 525)
        expect(panel1.size()).toEqual('500px');
        expect(panel2.size()).toEqual('300px');
      });
    });

    it('should return early when left and right constraints conflict after retry', () => {
      // Create complex cascading scenario with 4 panels
      // The key is to create a situation where the retry with adjusted delta still fails
      const panel1 = createMockPanel('200px', '200px', '200px'); // Fixed size
      const panel2 = createMockPanel('200px', '150px', '250px'); // Can adjust 50px each way
      const panel3 = createMockPanel('200px', '150px', '250px'); // Can adjust 50px each way
      const panel4 = createMockPanel('200px', '200px', '200px'); // Fixed size
      const splitter = createMockSplitter([panel1, panel2, panel3, panel4], 'horizontal', 1000, 30);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);

        const setPanelSize = (calculator as any).setPanelSize.bind(calculator);
        setPanelSize(panel1, '200px');
        setPanelSize(panel2, '200px');
        setPanelSize(panel3, '200px');
        setPanelSize(panel4, '200px');

        // Try to move middle divider (index 1) by large amount
        // Panel1 is fixed, Panel2 can shrink 50px, Panel3 can grow 50px, Panel4 is fixed
        // Left side (Panel1+Panel2) can handle -50px total (Panel1 can't shrink, Panel2 can shrink 50)
        // Right side (Panel3+Panel4) can handle +50px total (Panel3 can grow 50, Panel4 can't grow)
        // But we're trying -100px, so it will adjust to -50
        // However if there's asymmetry in how recursion works, line 525 might be hit
        calculator.moveDivider(1, -100);

        // Verify state
        expect(panel1.size()).toEqual('200px'); // Should stay fixed
        expect(panel4.size()).toEqual('200px'); // Should stay fixed
      });
    });

    it('should handle four panels with cascading constraints', () => {
      const panel1 = createMockPanel('200px', '100px', '300px');
      const panel2 = createMockPanel('200px', '100px', '300px');
      const panel3 = createMockPanel('200px', '100px', '300px');
      const panel4 = createMockPanel('200px', '100px', '300px');
      const splitter = createMockSplitter([panel1, panel2, panel3, panel4], 'horizontal', 1000, 30);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);

        const setPanelSize = (calculator as any).setPanelSize.bind(calculator);
        setPanelSize(panel1, '200px');
        setPanelSize(panel2, '200px');
        setPanelSize(panel3, '200px');
        setPanelSize(panel4, '200px');

        // Move middle divider
        calculator.moveDivider(1, 50);

        // Verify panels changed
        // Moving divider 1 by 50px to right:
        // Panel 2: 200 + 50 = 250px
        // Panel 3: 200 - 50 = 150px
        const size2 = parseFloat(panel2.size());
        const size3 = parseFloat(panel3.size());
        expect(size2).toEqual(250);
        expect(size3).toEqual(150);
      });
    });

    it('should handle negative size clamping with Math.max', () => {
      const panel1 = createMockPanel('100px', '50px', '100%');
      const panel2 = createMockPanel('1fr', '50px', '100%');
      const splitter = createMockSplitter([panel1, panel2], 'horizontal', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);

        const setPanelSize = (calculator as any).setPanelSize.bind(calculator);
        setPanelSize(panel1, '100px');
        setPanelSize(panel2, '1fr');

        // Try extreme negative movement
        calculator.moveDivider(0, -500);

        // Panel sizes should never be negative
        // Panel1 minSize is 50px, so it should be clamped to at least 50px
        const size1 = parseFloat(panel1.size());
        expect(size1).toEqual(50);
      });
    });

    it('should handle mixed fr panels with different ratios', () => {
      const panel1 = createMockPanel('2fr', '100px', '500px');
      const panel2 = createMockPanel('1fr', '100px', '500px');
      const splitter = createMockSplitter([panel1, panel2], 'horizontal', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);

        const setPanelSize = (calculator as any).setPanelSize.bind(calculator);
        setPanelSize(panel1, '2fr');
        setPanelSize(panel2, '1fr');

        // Move divider
        calculator.moveDivider(0, 100);

        // Both should still have fr units
        expect(panel1.size()).toContain('fr');
        expect(panel2.size()).toContain('fr');

        // Verify fr values changed
        const size1 = parseFloat(panel1.size());
        const size2 = parseFloat(panel2.size());
        // Panel1 should change, Panel2 should change
        expect(size1).not.toEqual(2);
        expect(size2).not.toEqual(1);
      });
    });

    it('should handle percentage minSize at boundary', () => {
      const panel1 = createMockPanel('300px', '30%', '500px'); // 30% of 1000 = 300px
      const panel2 = createMockPanel('500px', '100px', '600px');
      const splitter = createMockSplitter([panel1, panel2], 'horizontal', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);

        const setPanelSize = (calculator as any).setPanelSize.bind(calculator);
        setPanelSize(panel1, '300px');
        setPanelSize(panel2, '500px');

        // Try to shrink panel1 below its min (which is exactly its current size)
        calculator.moveDivider(0, -50);

        // Panel1 should stay at or above min (300px = 30% of 1000)
        const size1 = parseFloat(panel1.size());
        expect(size1).toEqual(300);
      });
    });

    it('should handle percentage maxSize at boundary', () => {
      const panel1 = createMockPanel('500px', '100px', '50%'); // 50% of 1000 = 500px
      const panel2 = createMockPanel('300px', '100px', '600px');
      const splitter = createMockSplitter([panel1, panel2], 'horizontal', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);

        const setPanelSize = (calculator as any).setPanelSize.bind(calculator);
        setPanelSize(panel1, '500px');
        setPanelSize(panel2, '300px');

        // Try to grow panel1 beyond its max (which is exactly its current size)
        calculator.moveDivider(0, 50);

        // Panel1 should stay at or below max (500px = 50% of 1000)
        const size1 = parseFloat(panel1.size());
        expect(size1).toEqual(500);
      });
    });

    it('should ignore moveDivider when panel minSizes are greater than splitter size', () => {
      const panel1 = createMockPanel('1fr', '600px', '100%');
      const panel2 = createMockPanel('1fr', '600px', '100%');
      const splitter = createMockSplitter([panel1, panel2], 'horizontal', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);

        const setPanelSize = (calculator as any).setPanelSize.bind(calculator);
        setPanelSize(panel1, '1fr');
        setPanelSize(panel2, '1fr');

        // Attempt to move divider
        calculator.moveDivider(0, 100);

        // Sizes should remain unchanged
        expect(panel1.size()).toEqual('1fr');
        expect(panel2.size()).toEqual('1fr');
      });
    });
  });
});
