/**
 * Icon Scale Calculator
 *
 * Parses the SVG path data of each Tabler icon used in the default registry
 * and calculates the scale factor needed to make the visible stroke/fill
 * content fill the full viewBox (24×24).
 *
 * Usage: npx tsx tools/calculate-icon-scales.ts
 */

interface IconData {
  width: number;
  height: number;
  body: string;
}

interface IconMapping {
  key: string;
  importName: string;
  importPath: string;
}

const ICON_MAPPINGS: IconMapping[] = [
  {
    key: 'accordion-collapse',
    importName: 'tablerChevronUp',
    importPath: '@iconify/icons-tabler/chevron-up',
  },
  {
    key: 'accordion-expand',
    importName: 'tablerChevronDown',
    importPath: '@iconify/icons-tabler/chevron-down',
  },
  {
    key: 'breadcrumb-separator',
    importName: 'tablerChevronRight',
    importPath: '@iconify/icons-tabler/chevron-right',
  },
  {
    key: 'breadcrumb-overflow',
    importName: 'tablerDots',
    importPath: '@iconify/icons-tabler/dots',
  },
  {
    key: 'calendar-trigger',
    importName: 'tablerCalendar',
    importPath: '@iconify/icons-tabler/calendar',
  },
  {
    key: 'calendar-previous-month',
    importName: 'tablerChevronLeft',
    importPath: '@iconify/icons-tabler/chevron-left',
  },
  {
    key: 'calendar-next-month',
    importName: 'tablerChevronRight',
    importPath: '@iconify/icons-tabler/chevron-right',
  },
  { key: 'checkbox-checked', importName: 'tablerCheck', importPath: '@iconify/icons-tabler/check' },
  {
    key: 'checkbox-indeterminate',
    importName: 'tablerMinus',
    importPath: '@iconify/icons-tabler/minus',
  },
  { key: 'chip-remove', importName: 'tablerX', importPath: '@iconify/icons-tabler/x' },
  { key: 'dialog-close', importName: 'tablerX', importPath: '@iconify/icons-tabler/x' },
  { key: 'drawer-close', importName: 'tablerX', importPath: '@iconify/icons-tabler/x' },
  {
    key: 'dropdown-toggle',
    importName: 'tablerChevronDown',
    importPath: '@iconify/icons-tabler/chevron-down',
  },
  { key: 'edit-confirm', importName: 'tablerCheck', importPath: '@iconify/icons-tabler/check' },
  {
    key: 'filter-active',
    importName: 'tablerFilterFilled',
    importPath: '@iconify/icons-tabler/filter-filled',
  },
  {
    key: 'filter-inactive',
    importName: 'tablerFilter',
    importPath: '@iconify/icons-tabler/filter',
  },
  { key: 'filter-remove', importName: 'tablerX', importPath: '@iconify/icons-tabler/x' },
  { key: 'input-clear', importName: 'tablerX', importPath: '@iconify/icons-tabler/x' },
  {
    key: 'menu-submenu',
    importName: 'tablerChevronRight',
    importPath: '@iconify/icons-tabler/chevron-right',
  },
  {
    key: 'paginator-previous',
    importName: 'tablerChevronLeft',
    importPath: '@iconify/icons-tabler/chevron-left',
  },
  {
    key: 'paginator-next',
    importName: 'tablerChevronRight',
    importPath: '@iconify/icons-tabler/chevron-right',
  },
  { key: 'search', importName: 'tablerSearch', importPath: '@iconify/icons-tabler/search' },
  {
    key: 'sort-neutral',
    importName: 'tablerArrowsSort',
    importPath: '@iconify/icons-tabler/arrows-sort',
  },
  {
    key: 'sort-ascending',
    importName: 'tablerSortAscending',
    importPath: '@iconify/icons-tabler/sort-ascending',
  },
  {
    key: 'sort-descending',
    importName: 'tablerSortDescending',
    importPath: '@iconify/icons-tabler/sort-descending',
  },
  {
    key: 'table-group-toggle',
    importName: 'tablerChevronRight',
    importPath: '@iconify/icons-tabler/chevron-right',
  },
  {
    key: 'tabs-scroll-left',
    importName: 'tablerChevronLeft',
    importPath: '@iconify/icons-tabler/chevron-left',
  },
  {
    key: 'tabs-scroll-right',
    importName: 'tablerChevronRight',
    importPath: '@iconify/icons-tabler/chevron-right',
  },
  { key: 'toast-close', importName: 'tablerX', importPath: '@iconify/icons-tabler/x' },
];

/**
 * Extracts all numeric coordinates from SVG path `d` attribute data.
 * Handles: M, m, L, l, H, h, V, v, C, c, S, s, Q, q, T, t, A, a, Z
 */
function extractPathBounds(
  d: string
): { minX: number; minY: number; maxX: number; maxY: number } | null {
  // Tokenize: split into commands and numbers
  const tokens = d.match(/[a-zA-Z]|[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/g);
  if (!tokens) return null;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let curX = 0;
  let curY = 0;
  let startX = 0;
  let startY = 0;

  function track(x: number, y: number) {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
    curX = x;
    curY = y;
  }

  let i = 0;
  function nextNum(): number {
    while (i < tokens.length && /^[a-zA-Z]$/.test(tokens[i])) i++;
    return i < tokens.length ? parseFloat(tokens[i++]) : 0;
  }

  while (i < tokens.length) {
    const cmd = tokens[i];
    if (!/^[a-zA-Z]$/.test(cmd)) {
      i++;
      continue;
    }
    i++;

    switch (cmd) {
      case 'M': {
        const x = nextNum();
        const y = nextNum();
        track(x, y);
        startX = x;
        startY = y;
        // Implicit lineTo for subsequent coordinate pairs
        while (i < tokens.length && !/^[a-zA-Z]$/.test(tokens[i])) {
          const lx = nextNum();
          const ly = nextNum();
          track(lx, ly);
        }
        break;
      }
      case 'm': {
        const dx = nextNum();
        const dy = nextNum();
        track(curX + dx, curY + dy);
        startX = curX;
        startY = curY;
        while (i < tokens.length && !/^[a-zA-Z]$/.test(tokens[i])) {
          const ldx = nextNum();
          const ldy = nextNum();
          track(curX + ldx, curY + ldy);
        }
        break;
      }
      case 'L':
        while (i < tokens.length && !/^[a-zA-Z]$/.test(tokens[i])) {
          track(nextNum(), nextNum());
        }
        break;
      case 'l':
        while (i < tokens.length && !/^[a-zA-Z]$/.test(tokens[i])) {
          track(curX + nextNum(), curY + nextNum());
        }
        break;
      case 'H':
        while (i < tokens.length && !/^[a-zA-Z]$/.test(tokens[i])) {
          track(nextNum(), curY);
        }
        break;
      case 'h':
        while (i < tokens.length && !/^[a-zA-Z]$/.test(tokens[i])) {
          track(curX + nextNum(), curY);
        }
        break;
      case 'V':
        while (i < tokens.length && !/^[a-zA-Z]$/.test(tokens[i])) {
          track(curX, nextNum());
        }
        break;
      case 'v':
        while (i < tokens.length && !/^[a-zA-Z]$/.test(tokens[i])) {
          track(curX, curY + nextNum());
        }
        break;
      case 'C':
        while (i < tokens.length && !/^[a-zA-Z]$/.test(tokens[i])) {
          track(nextNum(), nextNum()); // control point 1
          track(nextNum(), nextNum()); // control point 2
          track(nextNum(), nextNum()); // end point
        }
        break;
      case 'c':
        while (i < tokens.length && !/^[a-zA-Z]$/.test(tokens[i])) {
          const bx = curX;
          const by = curY;
          track(bx + nextNum(), by + nextNum());
          track(bx + nextNum(), by + nextNum());
          track(bx + nextNum(), by + nextNum());
        }
        break;
      case 'S':
        while (i < tokens.length && !/^[a-zA-Z]$/.test(tokens[i])) {
          track(nextNum(), nextNum());
          track(nextNum(), nextNum());
        }
        break;
      case 's':
        while (i < tokens.length && !/^[a-zA-Z]$/.test(tokens[i])) {
          const bx = curX;
          const by = curY;
          track(bx + nextNum(), by + nextNum());
          track(bx + nextNum(), by + nextNum());
        }
        break;
      case 'Q':
        while (i < tokens.length && !/^[a-zA-Z]$/.test(tokens[i])) {
          track(nextNum(), nextNum());
          track(nextNum(), nextNum());
        }
        break;
      case 'q':
        while (i < tokens.length && !/^[a-zA-Z]$/.test(tokens[i])) {
          const bx = curX;
          const by = curY;
          track(bx + nextNum(), by + nextNum());
          track(bx + nextNum(), by + nextNum());
        }
        break;
      case 'T':
        while (i < tokens.length && !/^[a-zA-Z]$/.test(tokens[i])) {
          track(nextNum(), nextNum());
        }
        break;
      case 't':
        while (i < tokens.length && !/^[a-zA-Z]$/.test(tokens[i])) {
          track(curX + nextNum(), curY + nextNum());
        }
        break;
      case 'A':
        while (i < tokens.length && !/^[a-zA-Z]$/.test(tokens[i])) {
          const rx = nextNum();
          const ry = nextNum();
          nextNum(); // rotation
          nextNum(); // large-arc
          nextNum(); // sweep
          const ax = nextNum();
          const ay = nextNum();
          // Approximate arc bounds: expand by radius from midpoint of start→end
          const aMidX = (curX + ax) / 2;
          const aMidY = (curY + ay) / 2;
          minX = Math.min(minX, aMidX - rx);
          maxX = Math.max(maxX, aMidX + rx);
          minY = Math.min(minY, aMidY - ry);
          maxY = Math.max(maxY, aMidY + ry);
          track(ax, ay);
        }
        break;
      case 'a':
        while (i < tokens.length && !/^[a-zA-Z]$/.test(tokens[i])) {
          const rx = nextNum();
          const ry = nextNum();
          nextNum(); // rotation
          nextNum(); // large-arc
          nextNum(); // sweep
          const aStartX = curX;
          const aStartY = curY;
          const endX = aStartX + nextNum();
          const endY = aStartY + nextNum();
          // Approximate arc bounds: expand by radius from midpoint of start→end
          const aMidX = (aStartX + endX) / 2;
          const aMidY = (aStartY + endY) / 2;
          minX = Math.min(minX, aMidX - rx);
          maxX = Math.max(maxX, aMidX + rx);
          minY = Math.min(minY, aMidY - ry);
          maxY = Math.max(maxY, aMidY + ry);
          track(endX, endY);
        }
        break;
      case 'Z':
      case 'z':
        curX = startX;
        curY = startY;
        break;
    }
  }

  if (minX === Infinity) return null;
  return { minX, minY, maxX, maxY };
}

/**
 * Extracts bounding box from full SVG body (may contain multiple <path> and other elements).
 */
function extractBodyBounds(
  body: string,
  strokeWidth: number
): { minX: number; minY: number; maxX: number; maxY: number } | null {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  // Extract all d="" attributes from path elements
  const pathRegex = /\bd="([^"]+)"/g;
  let match: RegExpExecArray | null;
  while ((match = pathRegex.exec(body)) !== null) {
    const bounds = extractPathBounds(match[1]);
    if (bounds) {
      if (bounds.minX < minX) minX = bounds.minX;
      if (bounds.minY < minY) minY = bounds.minY;
      if (bounds.maxX > maxX) maxX = bounds.maxX;
      if (bounds.maxY > maxY) maxY = bounds.maxY;
    }
  }

  // Extract circle elements: cx, cy, r
  const circleRegex = /<circle[^>]*>/g;
  while ((match = circleRegex.exec(body)) !== null) {
    const el = match[0];
    const cx = parseFloat(el.match(/\bcx="([^"]+)"/)?.[1] ?? '0');
    const cy = parseFloat(el.match(/\bcy="([^"]+)"/)?.[1] ?? '0');
    const r = parseFloat(el.match(/\br="([^"]+)"/)?.[1] ?? '0');
    minX = Math.min(minX, cx - r);
    maxX = Math.max(maxX, cx + r);
    minY = Math.min(minY, cy - r);
    maxY = Math.max(maxY, cy + r);
  }

  // Extract rect elements
  const rectRegex = /<rect[^>]*>/g;
  while ((match = rectRegex.exec(body)) !== null) {
    const el = match[0];
    const x = parseFloat(el.match(/\bx="([^"]+)"/)?.[1] ?? '0');
    const y = parseFloat(el.match(/\by="([^"]+)"/)?.[1] ?? '0');
    const w = parseFloat(el.match(/\bwidth="([^"]+)"/)?.[1] ?? '0');
    const h = parseFloat(el.match(/\bheight="([^"]+)"/)?.[1] ?? '0');
    // Skip transparent/none fill rects that cover the full viewBox (spacer rects)
    if (w === 24 && h === 24) continue;
    if (w > 0 && h > 0) {
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x + w);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y + h);
    }
  }

  if (minX === Infinity) return null;

  // Expand by half stroke width (stroke extends beyond path coordinates)
  const half = strokeWidth / 2;
  return {
    minX: minX - half,
    minY: minY - half,
    maxX: maxX + half,
    maxY: maxY + half,
  };
}

function extractStrokeWidth(body: string): number {
  const match = body.match(/stroke-width="([^"]+)"/);
  return match ? parseFloat(match[1]) : 0;
}

async function main() {
  const { createRequire } = await import('module');
  const require = createRequire(
    new URL('file://' + process.cwd() + '/packages/controls/src/default-icons/provider.ts')
  );

  // Deduplicate by importPath to avoid loading same icon multiple times
  const uniqueIcons = new Map<string, IconMapping>();
  for (const mapping of ICON_MAPPINGS) {
    if (!uniqueIcons.has(mapping.importPath)) {
      uniqueIcons.set(mapping.importPath, mapping);
    }
  }

  // Load icon data and compute scales
  const scaleByPath = new Map<string, number>();

  for (const [importPath] of uniqueIcons) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require(importPath) as { default: IconData };
    const iconData = mod.default;
    const strokeWidth = extractStrokeWidth(iconData.body);
    const bounds = extractBodyBounds(iconData.body, strokeWidth);

    if (!bounds) {
      console.warn(`  Could not parse bounds for ${importPath}`);
      scaleByPath.set(importPath, 1);
      continue;
    }

    const width = iconData.width ?? 24;
    const height = iconData.height ?? 24;

    // The content occupies bounds.maxX - bounds.minX in width, bounds.maxY - bounds.minY in height
    const contentW = bounds.maxX - bounds.minX;
    const contentH = bounds.maxY - bounds.minY;

    // Scale = viewBox size / largest content dimension
    // This is how much we need to zoom to make the content fill the viewBox
    const scaleX = width / contentW;
    const scaleY = height / contentH;
    const scale = Math.min(scaleX, scaleY);

    // Clamp: never downscale, round to 2 decimal places
    const rounded = Math.round(Math.max(scale, 1) * 100) / 100;

    const iconName = importPath.split('/').pop();
    console.log(
      `  ${iconName}: bounds=[${bounds.minX.toFixed(1)}, ${bounds.minY.toFixed(1)}, ${bounds.maxX.toFixed(1)}, ${bounds.maxY.toFixed(1)}] ` +
        `content=${contentW.toFixed(1)}x${contentH.toFixed(1)} stroke=${strokeWidth} scale=${rounded}`
    );

    scaleByPath.set(importPath, rounded);
  }

  // Output the registry with computed scales
  console.log('\n--- Registry values ---\n');
  for (const mapping of ICON_MAPPINGS) {
    const scale = scaleByPath.get(mapping.importPath) ?? 1;
    console.log(`  '${mapping.key}': { icon: ${mapping.importName}, scale: ${scale} },`);
  }
}

main().catch(console.error);
