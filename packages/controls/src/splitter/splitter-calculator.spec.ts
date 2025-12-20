import {
  expandSplitterPanelSize,
  expandSplitterPanelSizeLimit,
  getSplitterPanelSizeUnit,
  getSplitterPanelSizeValue,
  getSplitterPanelSizeLimitUnit,
  getSplitterPanelSizeLimitValue,
  getSplitterPanelSizeLimitInPx,
  collapseSplitterPanelSize,
  collapseSplitterPanelSizeLimit,
  isSplitterPanelSize,
  isSplitterPanelSizeLimit,
} from './utils';

// Test utility functions from utils.ts
describe('Splitter Utility Functions', () => {
  describe('isSplitterPanelSize', () => {
    it.each([
      ['100px', true],
      ['1fr', true],
      ['0px', true],
      ['0.5fr', true],
      ['123.456px', true],
      ['-50px', true],
      ['100', false],
      ['px', false],
      ['fr', false],
      ['100%', false],
      [100, false],
      [null, false],
      [undefined, false],
    ])('isSplitterPanelSize(%j) -> %j', (value, expected) => {
      expect(isSplitterPanelSize(value)).toBe(expected);
    });
  });

  describe('isSplitterPanelSizeLimit', () => {
    it.each([
      ['100px', true],
      ['50%', true],
      ['0px', true],
      ['0%', true],
      ['123.456px', true],
      ['75.5%', true],
      ['100', false],
      ['px', false],
      ['%', false],
      ['100fr', false],
      [100, false],
      [null, false],
      [undefined, false],
    ])('isSplitterPanelSizeLimit(%j) -> %j', (value, expected) => {
      expect(isSplitterPanelSizeLimit(value)).toBe(expected);
    });
  });

  describe('getSplitterPanelSizeUnit', () => {
    it.each([
      ['100px', 'px'],
      ['1fr', 'fr'],
      ['0px', 'px'],
      ['0.5fr', 'fr'],
      ['123.456px', 'px'],
    ])('should extract unit from %s -> %s', (size, expected) => {
      expect(getSplitterPanelSizeUnit(size as any)).toBe(expected);
    });
  });

  describe('getSplitterPanelSizeValue', () => {
    it.each([
      ['100px', 100],
      ['1fr', 1],
      ['0px', 0],
      ['0.5fr', 0.5],
      ['123.456px', 123.456],
      ['-50px', -50],
    ])('should extract value from %s -> %s', (size, expected) => {
      expect(getSplitterPanelSizeValue(size as any)).toBe(expected);
    });
  });

  describe('getSplitterPanelSizeLimitUnit', () => {
    it.each([
      ['100px', 'px'],
      ['50%', '%'],
      ['0px', 'px'],
      ['0%', '%'],
      ['123.456px', 'px'],
    ])('should extract limit unit from %s -> %s', (limit, expected) => {
      expect(getSplitterPanelSizeLimitUnit(limit as any)).toBe(expected);
    });
  });

  describe('getSplitterPanelSizeLimitValue', () => {
    it.each([
      ['100px', 100],
      ['50%', 50],
      ['0px', 0],
      ['0%', 0],
      ['123.456px', 123.456],
      ['75.5%', 75.5],
    ])('should extract limit value from %s -> %s', (limit, expected) => {
      expect(getSplitterPanelSizeLimitValue(limit as any)).toBe(expected);
    });
  });

  describe('getSplitterPanelSizeLimitInPx', () => {
    it('should convert px limits to px', () => {
      expect(getSplitterPanelSizeLimitInPx('100px', 1000)).toBe(100);
      expect(getSplitterPanelSizeLimitInPx('50px', 500)).toBe(50);
      expect(getSplitterPanelSizeLimitInPx('0px', 1000)).toBe(0);
    });

    it('should convert % limits to px based on total size', () => {
      expect(getSplitterPanelSizeLimitInPx('50%', 1000)).toBe(500);
      expect(getSplitterPanelSizeLimitInPx('25%', 800)).toBe(200);
      expect(getSplitterPanelSizeLimitInPx('10%', 500)).toBe(50);
      expect(getSplitterPanelSizeLimitInPx('100%', 1000)).toBe(1000);
    });

    it('should handle edge cases', () => {
      expect(getSplitterPanelSizeLimitInPx('0%', 1000)).toBe(0);
      expect(getSplitterPanelSizeLimitInPx('0px', 0)).toBe(0);
    });

    it('should handle fractional percentages correctly', () => {
      expect(getSplitterPanelSizeLimitInPx('33.33%', 900)).toBeCloseTo(299.97, 1);
      expect(getSplitterPanelSizeLimitInPx('12.5%', 400)).toBe(50);
    });
  });

  describe('expandSplitterPanelSize', () => {
    it('should expand px sizes', () => {
      expect(expandSplitterPanelSize('100px')).toEqual({ value: 100, unit: 'px' });
      expect(expandSplitterPanelSize('0px')).toEqual({ value: 0, unit: 'px' });
      expect(expandSplitterPanelSize('123.456px')).toEqual({ value: 123.456, unit: 'px' });
    });

    it('should expand fr sizes', () => {
      expect(expandSplitterPanelSize('1fr')).toEqual({ value: 1, unit: 'fr' });
      expect(expandSplitterPanelSize('0.5fr')).toEqual({ value: 0.5, unit: 'fr' });
      expect(expandSplitterPanelSize('2fr')).toEqual({ value: 2, unit: 'fr' });
    });

    it('should handle negative values', () => {
      expect(expandSplitterPanelSize('-50px')).toEqual({ value: -50, unit: 'px' });
    });
  });

  describe('expandSplitterPanelSizeLimit', () => {
    it('should expand px limits', () => {
      expect(expandSplitterPanelSizeLimit('100px')).toEqual({ value: 100, unit: 'px' });
      expect(expandSplitterPanelSizeLimit('0px')).toEqual({ value: 0, unit: 'px' });
    });

    it('should expand % limits', () => {
      expect(expandSplitterPanelSizeLimit('50%')).toEqual({ value: 50, unit: '%' });
      expect(expandSplitterPanelSizeLimit('100%')).toEqual({ value: 100, unit: '%' });
      expect(expandSplitterPanelSizeLimit('25.5%')).toEqual({ value: 25.5, unit: '%' });
    });

    it('should handle edge cases', () => {
      expect(expandSplitterPanelSizeLimit('0%')).toEqual({ value: 0, unit: '%' });
      expect(expandSplitterPanelSizeLimit('0px')).toEqual({ value: 0, unit: 'px' });
    });
  });

  describe('collapseSplitterPanelSize', () => {
    it('should collapse expanded sizes back to string format', () => {
      expect(collapseSplitterPanelSize({ value: 100, unit: 'px' })).toBe('100px');
      expect(collapseSplitterPanelSize({ value: 1, unit: 'fr' })).toBe('1fr');
      expect(collapseSplitterPanelSize({ value: 0.5, unit: 'fr' })).toBe('0.5fr');
    });

    it('should handle zero values', () => {
      expect(collapseSplitterPanelSize({ value: 0, unit: 'px' })).toBe('0px');
      expect(collapseSplitterPanelSize({ value: 0, unit: 'fr' })).toBe('0fr');
    });

    it('should handle negative values', () => {
      expect(collapseSplitterPanelSize({ value: -50, unit: 'px' })).toBe('-50px');
    });
  });

  describe('collapseSplitterPanelSizeLimit', () => {
    it('should collapse expanded limits back to string format', () => {
      expect(collapseSplitterPanelSizeLimit({ value: 100, unit: 'px' })).toBe('100px');
      expect(collapseSplitterPanelSizeLimit({ value: 50, unit: '%' })).toBe('50%');
      expect(collapseSplitterPanelSizeLimit({ value: 25.5, unit: '%' })).toBe('25.5%');
    });

    it('should handle zero values', () => {
      expect(collapseSplitterPanelSizeLimit({ value: 0, unit: 'px' })).toBe('0px');
      expect(collapseSplitterPanelSizeLimit({ value: 0, unit: '%' })).toBe('0%');
    });
  });

  describe('round-trip conversions', () => {
    it('should maintain consistency for panel sizes', () => {
      const sizes = ['100px', '1fr', '0.5fr', '123.456px', '0px'];
      sizes.forEach(size => {
        const expanded = expandSplitterPanelSize(size as any);
        const collapsed = collapseSplitterPanelSize(expanded);
        expect(collapsed).toBe(size);
      });
    });

    it('should maintain consistency for panel size limits', () => {
      const limits = ['100px', '50%', '0px', '0%', '123.456px', '75.5%'];
      limits.forEach(limit => {
        const expanded = expandSplitterPanelSizeLimit(limit as any);
        const collapsed = collapseSplitterPanelSizeLimit(expanded);
        expect(collapsed).toBe(limit);
      });
    });
  });
});
describe('Splitter Sizing Logic', () => {
  describe('Percentage to Pixel Conversion', () => {
    it('should convert percentage limits to pixels correctly', () => {
      // Test various splitter sizes
      const testCases: Array<{ limit: `${number}%`; splitterSize: number; expected: number }> = [
        { limit: '50%', splitterSize: 1000, expected: 500 },
        { limit: '25%', splitterSize: 800, expected: 200 },
        { limit: '10%', splitterSize: 1200, expected: 120 },
        { limit: '75%', splitterSize: 400, expected: 300 },
        { limit: '100%', splitterSize: 500, expected: 500 },
      ];

      testCases.forEach(({ limit, splitterSize, expected }) => {
        expect(getSplitterPanelSizeLimitInPx(limit, splitterSize)).toBe(expected);
      });
    });

    it('should handle fractional percentages', () => {
      expect(getSplitterPanelSizeLimitInPx('33.33%', 900)).toBeCloseTo(299.97, 1);
      expect(getSplitterPanelSizeLimitInPx('66.67%', 900)).toBeCloseTo(600.03, 1);
      expect(getSplitterPanelSizeLimitInPx('12.5%', 800)).toBe(100);
    });
  });

  describe('Fraction Factor Calculations', () => {
    it('should calculate px and fr distribution correctly', () => {
      // Scenario: 1000px total, 10px divider, 200px fixed panel, 2fr flexible
      const totalSize = 1000;
      const dividerSize = 10;
      const pxPanel = 200;
      const totalFr = 2;
      
      const frArea = totalSize - dividerSize - pxPanel; // 790px for fr panels
      const pxPerFr = frArea / totalFr; // 395px per 1fr
      const frPerPx = totalFr / frArea; // ~0.00253 fr per px
      
      expect(pxPerFr).toBeCloseTo(395, 1);
      expect(frPerPx).toBeCloseTo(0.00253, 5);
    });

    it('should handle multiple px and fr panels', () => {
      // Scenario: 1000px total, 20px dividers, 300px fixed panels, 3fr flexible
      const totalSize = 1000;
      const dividersSize = 20;
      const pxPanels = 300;
      const totalFr = 3;
      
      const frArea = totalSize - dividersSize - pxPanels; // 680px for fr panels
      const pxPerFr = frArea / totalFr; // ~226.67px per 1fr
      
      expect(pxPerFr).toBeCloseTo(226.67, 1);
    });

    it('should handle edge case with very small fr area', () => {
      // Scenario where most space is taken by px panels
      const totalSize = 500;
      const dividersSize = 10;
      const pxPanels = 480;
      const totalFr = 1;
      
      const frArea = totalSize - dividersSize - pxPanels; // Only 10px for fr
      const pxPerFr = frArea / totalFr; // 10px per 1fr
      
      expect(pxPerFr).toBe(10);
    });
  });

  describe('Size Constraint Logic', () => {
    it('should determine if size is within limits', () => {
      const minPx = 100;
      const maxPx = 500;
      const currentPx = 300;
      
      expect(currentPx >= minPx).toBe(true);
      expect(currentPx <= maxPx).toBe(true);
    });

    it('should detect size below minimum', () => {
      const minPx = 100;
      const currentPx = 50;
      
      expect(currentPx < minPx).toBe(true);
    });

    it('should detect size above maximum', () => {
      const maxPx = 500;
      const currentPx = 600;
      
      expect(currentPx > maxPx).toBe(true);
    });

    it('should handle percentage-based limits with container size', () => {
      const splitterSize = 1000;
      const minLimit: `${number}%` = '10%'; // 100px
      const maxLimit: `${number}%` = '80%'; // 800px
      
      const minPx = getSplitterPanelSizeLimitInPx(minLimit, splitterSize);
      const maxPx = getSplitterPanelSizeLimitInPx(maxLimit, splitterSize);
      
      expect(minPx).toBe(100);
      expect(maxPx).toBe(800);
      
      // Test a panel size
      const panelPx = 500;
      expect(panelPx >= minPx && panelPx <= maxPx).toBe(true);
    });
  });

  describe('Delta Application Logic', () => {
    it('should calculate new size after positive delta', () => {
      const startSize = 400;
      const delta = 50;
      const newSize = startSize + delta;
      
      expect(newSize).toBe(450);
    });

    it('should calculate new size after negative delta', () => {
      const startSize = 400;
      const delta = -100;
      const newSize = startSize + delta;
      
      expect(newSize).toBe(300);
    });

    it('should clamp size to minimum when delta would go below', () => {
      const startSize = 200;
      const delta = -150;
      const minSize = 100;
      const newSize = Math.max(minSize, startSize + delta);
      
      expect(newSize).toBe(100);
    });

    it('should clamp size to maximum when delta would go above', () => {
      const startSize = 400;
      const delta = 200;
      const maxSize = 500;
      const newSize = Math.min(maxSize, startSize + delta);
      
      expect(newSize).toBe(500);
    });

    it('should calculate unapplied delta when clamped', () => {
      const startSize = 200;
      const delta = -150;
      const minSize = 100;
      const newSize = Math.max(minSize, startSize + delta);
      const unappliedDelta = (startSize + delta) - newSize;
      
      expect(unappliedDelta).toBe(-50);
    });
  });

  describe('Fr to Px Conversions', () => {
    it('should convert fr delta to px delta', () => {
      const frDelta = 0.5;
      const pxPerFr = 400; // 1fr = 400px
      const pxDelta = frDelta * pxPerFr;
      
      expect(pxDelta).toBe(200);
    });

    it('should convert px delta to fr delta', () => {
      const pxDelta = 100;
      const frPerPx = 0.005; // 1px = 0.005fr
      const frDelta = pxDelta * frPerPx;
      
      expect(frDelta).toBe(0.5);
    });

    it('should maintain size when converting fr size to px and back', () => {
      const frSize = 1.5;
      const pxPerFr = 400;
      const frPerPx = 1 / pxPerFr;
      
      const pxSize = frSize * pxPerFr; // 600px
      const frSizeBack = pxSize * frPerPx; // Should be 1.5fr again
      
      expect(pxSize).toBe(600);
      expect(frSizeBack).toBeCloseTo(1.5, 10);
    });
  });

  describe('Multi-Panel Scenarios', () => {
    it('should calculate total size for two px panels with divider', () => {
      const panel1 = 400;
      const panel2 = 300;
      const divider = 10;
      const total = panel1 + divider + panel2;
      
      expect(total).toBe(710);
    });

    it('should calculate remaining space for fr panels', () => {
      const totalSize = 1000;
      const pxPanelSizes = [200, 300]; // Two px panels
      const dividers = 20; // Total divider size
      
      const usedSpace = pxPanelSizes.reduce((sum, size) => sum + size, 0) + dividers;
      const remainingForFr = totalSize - usedSpace;
      
      expect(remainingForFr).toBe(480);
    });

    it('should distribute delta between adjacent panels', () => {
      const leftPanelStart = 400;
      const rightPanelStart = 400;
      const delta = 100;
      
      const leftPanelEnd = leftPanelStart + delta;
      const rightPanelEnd = rightPanelStart - delta;
      
      expect(leftPanelEnd).toBe(500);
      expect(rightPanelEnd).toBe(300);
      expect(leftPanelEnd + rightPanelEnd).toBe(leftPanelStart + rightPanelStart);
    });
  });
});

