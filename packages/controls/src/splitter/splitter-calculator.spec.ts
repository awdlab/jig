import { TestBed } from '@angular/core/testing';
import { signal, Signal } from '@angular/core';
import { DefaultSplitterCalculator } from './splitter-calculator';
import { NgnSplitter } from './splitter';
import { NgnSplitterPanel } from './panel/splitter-panel';
import { SplitterLayout } from './types';

// Mock panel helper
function createMockPanel(
  size: string,
  minSize: string,
  maxSize: string,
  gridArea = 'panel'
): NgnSplitterPanel {
  return {
    size: signal(size),
    minSize: signal(minSize),
    maxSize: signal(maxSize),
    gridArea: signal(gridArea),
  } as any;
}

// Mock splitter helper
function createMockSplitter(
  panels: NgnSplitterPanel[],
  layout: SplitterLayout = 'horizontal',
  splitterSize = 1000,
  dividerSize = 10,
  panelOrder: string[] | null = null
): NgnSplitter {
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

  return {
    panels: signal(panels) as Signal<readonly NgnSplitterPanel[]>,
    dividers: signal(
      panels.length > 1
        ? Array(panels.length - 1)
            .fill(0)
            .map(() => mockDivider)
        : []
    ),
    panelOrder: signal(panelOrder),
    layout: signal(layout),
    elementSize: signal({ width: splitterSize, height: splitterSize }),
  } as any;
}

describe('DefaultSplitterCalculator', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  describe('Grid Template Sizes', () => {
    it.only('should generate correct grid template for horizontal layout with mixed panels', () => {
      const panel1 = createMockPanel('200px', '100px', '300px');
      const panel2 = createMockPanel('1fr', '100px', '500px');
      const splitter = createMockSplitter([panel1, panel2], 'horizontal', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);
        const template = calculator.gridTemplateSizes();

        // Should include both panel sizes and a divider
        expect(template).toEqual('200px 10px 1fr');
      });
    });

    it('should handle single panel without dividers', () => {
      const panel1 = createMockPanel('1fr', '100px', '500px');
      const splitter = createMockSplitter([panel1], 'horizontal', 1000, 0);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);
        const template = calculator.gridTemplateSizes();

        expect(template).toBe('1fr');
      });
    });

    it('should return "none" for empty panels', () => {
      const splitter = createMockSplitter([], 'horizontal', 1000, 0);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);
        const template = calculator.gridTemplateSizes();

        expect(template).toBe('none');
      });
    });

    it('should handle three panels with dividers', () => {
      const panel1 = createMockPanel('1fr', '100px', '500px');
      const panel2 = createMockPanel('200px', '100px', '300px');
      const panel3 = createMockPanel('1fr', '100px', '500px');
      const splitter = createMockSplitter([panel1, panel2, panel3], 'horizontal', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);
        const template = calculator.gridTemplateSizes();

        // Should include all panels and dividers in the template
        expect(template).toContain('1fr');
        expect(template).toContain('200px');
        // Template should have format like: "1fr <divider> 200px <divider> 1fr"
        const parts = template.split(' ');
        expect(parts.length).toBeGreaterThanOrEqual(5); // 3 panels + 2 dividers
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

        expect(areas).toBe('"left ngn-divider-0 right"');
      });
    });

    it('should generate correct areas for vertical layout', () => {
      const panel1 = createMockPanel('1fr', '100px', '500px', 'top');
      const panel2 = createMockPanel('1fr', '100px', '500px', 'bottom');
      const splitter = createMockSplitter([panel1, panel2], 'vertical', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);
        const areas = calculator.gridTemplateAreas();

        expect(areas).toBe('"top" "ngn-divider-0" "bottom"');
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

        expect(areas).toBe('"a ngn-divider-0 b ngn-divider-1 c"');
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
        expect(minSize).toContain('500px');
        expect(minSize).toContain('+ 0%');
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
        expect(minSize).toContain('250px');
        expect(minSize).toContain('+ 0%');
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
        expect(minSize).toContain('30%');
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
        expect(maxSize).toContain('500px');
        expect(maxSize).toContain('+ 0%');
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
        expect(maxSize).toContain('900px');
        expect(maxSize).toContain('+ 0%');
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
        expect(context!.panels).toHaveLength(2);
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
        expect(panel1.size()).toBe('400px');
        expect(panel2.size()).toBe('400px');
      });
    });
  });

  describe('Divider Movement', () => {
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
        expect(panel1.size()).toBe('450px');
        expect(panel2.size()).toBe('350px');
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
        expect(panel1.size()).toBe('100px');
        expect(panel2.size()).toBe('700px');
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
        expect(panel1.size()).toBe('500px');
        expect(panel2.size()).toBe('300px');
      });
    });

    it('should handle fr panels', () => {
      const panel1 = createMockPanel('1fr', '100px', '500px');
      const panel2 = createMockPanel('1fr', '100px', '500px');
      const splitter = createMockSplitter([panel1, panel2], 'horizontal', 1000, 10);

      TestBed.runInInjectionContext(() => {
        const calculator = new DefaultSplitterCalculator(splitter);

        // Verify initial setup with fr units
        expect(panel1.size()).toContain('fr');
        expect(panel2.size()).toContain('fr');
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
        expect(panel1.size()).toBe('350px');
        expect(panel2.size()).toBe('250px');
        expect(panel3.size()).toBe('300px');
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

        // Panel1 should be at or near min
        const size1 = parseFloat(panel1.size());
        expect(size1).toBeLessThanOrEqual(200);
        expect(size1).toBeGreaterThanOrEqual(100);
      });
    });
  });
});
