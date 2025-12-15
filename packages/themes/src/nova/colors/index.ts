type ColorShades = {
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
};

export function getColorShade(baseColor: string, level: number): string {
  return `hsl(from ${baseColor} h s ${(1000 - level) / 10})`;
}

const colors = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

export function getColorPalette(baseColor: string): ColorShades {
  return colors.reduce(
    (acc, level) => {
      acc[level.toString() as keyof ColorShades] = getColorShade(baseColor, level);
      return acc;
    },
    {} as ColorShades
  );
}

export const inkColor = getColorPalette('#4d29ff');

export const mustardColor = getColorPalette('#ffc300');

export const bubblegumColor = getColorPalette('#ff248a');

export const forestVerdantColor = getColorPalette('#27c427');

export const solarMarigoldColor = getColorPalette('#ff9500');

export const crimsonFlameColor = getColorPalette('#ed1612');

export const electricSkyColor = getColorPalette('#0da6f2');

export const greyColor = getColorPalette('#475569');
