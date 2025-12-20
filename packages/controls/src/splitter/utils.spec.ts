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
describe('Splitter Utils', () => {
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
