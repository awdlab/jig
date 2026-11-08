import { getColorPalette, getColorPaletteRgb } from '@awdlab/jig-themes/nova/colors';

// ponytail: shades are lightness-derived from these MD 500 tones; hardcode the full MD palettes if exact shade fidelity matters.
const indigoHex = '#3f51b5'; // primary
const pinkHex = '#e91e63'; // accent
const neutralHex = '#5f6368'; // surface + secondary (neutral grey)
const redHex = '#f44336'; // error
const orangeHex = '#ff9800'; // warning
const blueHex = '#2196f3'; // info
const greenHex = '#4caf50'; // success

export const indigoColor = getColorPalette(indigoHex);
export const pinkColor = getColorPalette(pinkHex);
export const neutralColor = getColorPalette(neutralHex);
export const redColor = getColorPalette(redHex);
export const orangeColor = getColorPalette(orangeHex);
export const blueColor = getColorPalette(blueHex);
export const greenColor = getColorPalette(greenHex);

export const indigoColorRgb = getColorPaletteRgb(indigoHex);
export const pinkColorRgb = getColorPaletteRgb(pinkHex);
export const neutralColorRgb = getColorPaletteRgb(neutralHex);
export const redColorRgb = getColorPaletteRgb(redHex);
export const orangeColorRgb = getColorPaletteRgb(orangeHex);
export const blueColorRgb = getColorPaletteRgb(blueHex);
export const greenColorRgb = getColorPaletteRgb(greenHex);

export { getColorPalette, getColorPaletteRgb };
