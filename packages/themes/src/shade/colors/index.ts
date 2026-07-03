import { autoContrast } from '@ngneers/controls-themes/api';

export type ShadeSchemeColors = {
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  input: string;
  ring: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  surface: string;
  surfaceForeground: string;
};

export type ShadeColors = {
  light: ShadeSchemeColors;
  dark: ShadeSchemeColors;
};

/**
 * Derives a contrast-safe foreground (near-white or near-black) for an arbitrary base color,
 * using the shared theme-domain {@link autoContrast} helper (relative OKLCH lightness pick,
 * resolved live by the browser) — the same logic nova applies to custom colors.
 */
export function getContrastForeground(color: string): string {
  return autoContrast(color);
}

/**
 * Returns a lightened variant of the given color (lightness increased by `amount`, capped at 95).
 */
export function getLightenedColor(color: string, amount: number): string {
  return `hsl(from ${color} h s calc(min(l + ${amount}, 95)))`;
}

/**
 * Creates the per-scheme color slot values for the shade theme.
 *
 * Without a `baseColor` the shadcn zinc defaults are returned. When a `baseColor` is
 * given, the primary/ring slots are derived from it via CSS relative color syntax.
 */
export function createShadeColors(baseColor?: string): ShadeColors {
  const light: ShadeSchemeColors = {
    background: '#ffffff',
    foreground: '#09090b',
    muted: '#f4f4f5',
    mutedForeground: '#71717a',
    border: '#e4e4e7',
    input: '#e4e4e7',
    ring: '#a1a1aa',
    primary: '#18181b',
    primaryForeground: '#fafafa',
    secondary: '#f4f4f5',
    secondaryForeground: '#18181b',
    accent: '#f4f4f5',
    accentForeground: '#18181b',
    destructive: '#dc2626',
    destructiveForeground: '#fafafa',
    surface: '#ffffff',
    surfaceForeground: '#09090b',
  };

  const dark: ShadeSchemeColors = {
    background: '#09090b',
    foreground: '#fafafa',
    muted: '#27272a',
    mutedForeground: '#a1a1aa',
    border: '#27272a',
    input: '#3f3f46',
    ring: '#52525b',
    primary: '#fafafa',
    primaryForeground: '#18181b',
    secondary: '#27272a',
    secondaryForeground: '#fafafa',
    accent: '#27272a',
    accentForeground: '#fafafa',
    destructive: '#ef4444',
    destructiveForeground: '#fafafa',
    surface: '#18181b',
    surfaceForeground: '#fafafa',
  };

  if (baseColor !== undefined) {
    light.primary = baseColor;
    light.primaryForeground = getContrastForeground(baseColor);
    light.ring = getLightenedColor(baseColor, 20);

    const darkPrimary = getLightenedColor(baseColor, 15);
    dark.primary = darkPrimary;
    dark.primaryForeground = getContrastForeground(darkPrimary);
    dark.ring = baseColor;
  }

  return { light, dark };
}

export const zincColors = createShadeColors();
