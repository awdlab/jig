import { getColorPalette, getColorPaletteRgb } from '@awdlab/jig-themes/nova/colors';

// Material Design base colors (the "500" tone of each MD palette). Shades are derived by nova's
// lightness-sweep ramp (getColorPalette) rather than the exact MD tonal hexes.
// ponytail: shades are lightness-derived from these bases, not the exact MD per-shade hexes;
// upgrade path = hardcode the full MD palettes + matching RGB if exact shade fidelity is needed.
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

// Re-export the palette helper so the color engine (Task 2) can build custom-primary values.
export { getColorPalette, getColorPaletteRgb };
