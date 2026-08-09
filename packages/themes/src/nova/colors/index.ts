import { type RGB, shadeRgb } from '@awdlab/jig-themes/api';

type ColorShades = {
  '25': string;
  '50': string;
  '100': string;
  '200': string;
  '300': string;
  '400': string;
  '500': string;
  '600': string;
  '700': string;
  '800': string;
  '900': string;
  '950': string;
  '975': string;
};

type ColorShadesRgb = Record<keyof ColorShades, RGB>;

/**
 * CSS value for a palette shade. Emitted as a relative-color `hsl(from …)`
 * expression so the browser resolves it (unchanged rendering). The concrete
 * RGB used for contrast decisions comes from {@link getColorPaletteRgb}.
 */
export function getColorShade(baseColor: string, level: number): string {
  return `hsl(from ${baseColor} h s ${(1000 - level) / 10})`;
}

const colors = [25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 975] as const;

export function getColorPalette(baseColor: string): ColorShades {
  return colors.reduce((acc, level) => {
    acc[level.toString() as keyof ColorShades] = getColorShade(baseColor, level);
    return acc;
  }, {} as ColorShades);
}

/** RGB variant of {@link getColorPalette}, used for contrast computation. */
export function getColorPaletteRgb(baseColor: string): ColorShadesRgb {
  return colors.reduce((acc, level) => {
    acc[level.toString() as keyof ColorShades] = shadeRgb(baseColor, level);
    return acc;
  }, {} as ColorShadesRgb);
}

const inkHex = '#4557ba';
const mustardHex = '#ffc300';
const bubblegumHex = '#ff248a';
const forestVerdantHex = '#27c427';
const solarMarigoldHex = '#ff9500';
const crimsonFlameHex = '#ed1612';
const electricSkyHex = '#0da6f2';
const greyHex = '#475569';

export const inkColor = getColorPalette(inkHex);
export const mustardColor = getColorPalette(mustardHex);
export const bubblegumColor = getColorPalette(bubblegumHex);
export const forestVerdantColor = getColorPalette(forestVerdantHex);
export const solarMarigoldColor = getColorPalette(solarMarigoldHex);
export const crimsonFlameColor = getColorPalette(crimsonFlameHex);
export const electricSkyColor = getColorPalette(electricSkyHex);
export const greyColor = getColorPalette(greyHex);

export const inkColorRgb = getColorPaletteRgb(inkHex);
export const mustardColorRgb = getColorPaletteRgb(mustardHex);
export const bubblegumColorRgb = getColorPaletteRgb(bubblegumHex);
export const forestVerdantColorRgb = getColorPaletteRgb(forestVerdantHex);
export const solarMarigoldColorRgb = getColorPaletteRgb(solarMarigoldHex);
export const crimsonFlameColorRgb = getColorPaletteRgb(crimsonFlameHex);
export const electricSkyColorRgb = getColorPaletteRgb(electricSkyHex);
export const greyColorRgb = getColorPaletteRgb(greyHex);
