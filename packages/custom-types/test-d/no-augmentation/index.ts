// No theme and no app augmentation loaded: kinds and colors stay unchecked strings.
import type { CustomColor, CustomKind, ThemeColor, ThemeKind } from '@awdlab/jig-custom-types';

const anyKind: CustomKind<'button'> = 'whatever';
const anyColor: CustomColor = 'whatever';

const noThemeKind: ThemeKind<'button'> extends never ? true : false = true;
const noThemeColor: ThemeColor extends never ? true : false = true;

export { anyColor, anyKind, noThemeColor, noThemeKind };
